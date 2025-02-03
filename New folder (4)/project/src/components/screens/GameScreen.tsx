import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { Screen, knownFolders, path, File, Utils } from "@nativescript/core";
import { requestPermissions } from "@nativescript/camera";

type GameScreenProps = {
    navigation: FrameNavigationProp<MainStackParamList, "Game">;
};

interface Asteroid {
    x: number;
    y: number;
    speed: number;
}

export function GameScreen({ navigation }: GameScreenProps) {
    const [spaceshipX, setSpaceshipX] = React.useState(Screen.mainScreen.widthDIPs / 2);
    const [asteroids, setAsteroids] = React.useState<Asteroid[]>([]);
    const [score, setScore] = React.useState(0);
    const [showJumpScare, setShowJumpScare] = React.useState(false);
    const [jumpScareSize, setJumpScareSize] = React.useState(0);
    const [difficultyMultiplier, setDifficultyMultiplier] = React.useState(1);
    const gameLoopRef = React.useRef<any>(null);
    const asteroidSpawnRef = React.useRef<any>(null);
    const difficultyTimerRef = React.useRef<any>(null);
    const jumpScareTimeoutRef = React.useRef<any>(null);
    const jumpScareAnimationRef = React.useRef<any>(null);
    const backgroundMusicRef = React.useRef<any>(null);
    const mediaRecorderRef = React.useRef<any>(null);
    const cameraRef = React.useRef<any>(null);
    const surfaceRef = React.useRef<any>(null);
    
    const SPACESHIP_SPEED = 20;
    const BASE_ASTEROID_SPEED = 13;
    const SPACESHIP_WIDTH = 80;
    const ASTEROID_WIDTH = 60;
    const JUMP_SCARE_TIME = 90000; // 90 seconds
    const DIFFICULTY_INCREASE_INTERVAL = 30000; // 30 seconds
    const DIFFICULTY_INCREASE_PERCENTAGE = 0.15; // 15% increase
    const JUMP_SCARE_ANIMATION_DURATION = 500; // 500ms for the growth animation
    const JUMP_SCARE_DISPLAY_DURATION = 2000; // 2 seconds total display time
    const FINAL_JUMP_SCARE_SIZE = Screen.mainScreen.widthDIPs * 2; // Changed to 2x screen width

    const setupPermissions = async () => {
        try {
            const cameraPermission = await requestPermissions();
            
            if (global.android) {
                const permissions = [
                    android.Manifest.permission.RECORD_AUDIO,
                    android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
                    android.Manifest.permission.READ_EXTERNAL_STORAGE
                ];
                
                await new Promise((resolve) => {
                    androidx.core.app.ActivityCompat.requestPermissions(
                        Utils.android.getCurrentActivity(),
                        permissions,
                        301
                    );
                    resolve(true);
                });
            }
        } catch (error) {
            console.error("Error requesting permissions:", error);
        }
    };

    const startRecording = async () => {
        if (!global.android) return;
        
        try {
            const dcimDir = android.os.Environment.getExternalStoragePublicDirectory(
                android.os.Environment.DIRECTORY_DCIM
            );
            const outputDir = new java.io.File(dcimDir, "AsteroidStrike");
            
            if (!outputDir.exists()) {
                const success = outputDir.mkdirs();
                if (!success) {
                    console.error("Failed to create directory");
                    return;
                }
                
                outputDir.setReadable(true, false);
                outputDir.setWritable(true, false);
            }

            const fileName = `reaction_${Date.now()}.mp4`;
            const outputFile = new java.io.File(outputDir, fileName);
            console.log("Saving video to:", outputFile.getAbsolutePath());

            const surfaceView = new android.view.SurfaceView(Utils.android.getCurrentActivity());
            const holder = surfaceView.getHolder();
            
            const mediaRecorder = new android.media.MediaRecorder();
            
            const cameraInstance = android.hardware.Camera.open(1);
            
            await new Promise<void>((resolve) => {
                holder.addCallback(new android.view.SurfaceHolder.Callback({
                    surfaceCreated: (holder) => {
                        try {
                            cameraInstance.setPreviewDisplay(holder);
                            cameraInstance.setDisplayOrientation(90);
                            cameraInstance.startPreview();
                            cameraInstance.unlock();
                            
                            mediaRecorder.setCamera(cameraInstance);
                            mediaRecorder.setAudioSource(android.media.MediaRecorder.AudioSource.MIC);
                            mediaRecorder.setVideoSource(android.media.MediaRecorder.VideoSource.CAMERA);
                            mediaRecorder.setOutputFormat(android.media.MediaRecorder.OutputFormat.MPEG_4);
                            mediaRecorder.setAudioEncoder(android.media.MediaRecorder.AudioEncoder.AAC);
                            mediaRecorder.setVideoEncoder(android.media.MediaRecorder.VideoEncoder.H264);
                            mediaRecorder.setVideoSize(1280, 720);
                            mediaRecorder.setVideoFrameRate(30);
                            mediaRecorder.setVideoEncodingBitRate(10000000);
                            mediaRecorder.setAudioEncodingBitRate(128000);
                            mediaRecorder.setOutputFile(outputFile.getAbsolutePath());
                            mediaRecorder.setPreviewDisplay(holder.getSurface());
                            
                            mediaRecorder.prepare();
                            mediaRecorder.start();
                            
                            mediaRecorderRef.current = mediaRecorder;
                            cameraRef.current = cameraInstance;
                            surfaceRef.current = surfaceView;
                            
                            console.log("Recording started successfully");
                            resolve();
                        } catch (error) {
                            console.error("Error in surface callback:", error);
                        }
                    },
                    surfaceChanged: () => {},
                    surfaceDestroyed: () => {}
                }));
            });
            
            const activity = Utils.android.getCurrentActivity();
            const params = new android.widget.FrameLayout.LayoutParams(1, 1);
            params.gravity = android.view.Gravity.TOP | android.view.Gravity.START;
            activity.addContentView(surfaceView, params);
            
        } catch (error) {
            console.error("Error starting video recording:", error);
        }
    };

    const stopRecording = () => {
        try {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current.reset();
                mediaRecorderRef.current.release();
                console.log("Recording stopped successfully");
            }
            if (cameraRef.current) {
                cameraRef.current.stopPreview();
                cameraRef.current.release();
            }
            if (surfaceRef.current) {
                const activity = Utils.android.getCurrentActivity();
                activity.runOnUiThread(new java.lang.Runnable({
                    run: () => {
                        const parent = surfaceRef.current.getParent();
                        if (parent) {
                            parent.removeView(surfaceRef.current);
                        }
                    }
                }));
            }
            mediaRecorderRef.current = null;
            cameraRef.current = null;
            surfaceRef.current = null;
        } catch (error) {
            console.error("Error stopping recording:", error);
        }
    };

    const startBackgroundMusic = () => {
        try {
            const audioPath = path.join(knownFolders.currentApp().path, "assets/audio/background.mp3");
            console.log("Audio path:", audioPath);
            backgroundMusicRef.current = new global.android.media.MediaPlayer();
            backgroundMusicRef.current.setDataSource(audioPath);
            backgroundMusicRef.current.setLooping(true);
            backgroundMusicRef.current.setVolume(0.2, 0.2);
            backgroundMusicRef.current.prepare();
            backgroundMusicRef.current.start();
        } catch (error) {
            console.error("Error starting background music:", error);
        }
    };

    const stopBackgroundMusic = () => {
        try {
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.stop();
                backgroundMusicRef.current.release();
                backgroundMusicRef.current = null;
            }
        } catch (error) {
            console.error("Error stopping background music:", error);
        }
    };

    const playJumpScareSound = () => {
        try {
            const audioPath = path.join(knownFolders.currentApp().path, "assets/audio/jumpscare.mp3");
            const jumpScareSound = new global.android.media.MediaPlayer();
            jumpScareSound.setDataSource(audioPath);
            jumpScareSound.setVolume(1.0, 1.0);
            jumpScareSound.prepare();
            jumpScareSound.start();
            
            jumpScareSound.setOnCompletionListener(new global.android.media.MediaPlayer.OnCompletionListener({
                onCompletion: (mp) => {
                    mp.release();
                }
            }));
        } catch (error) {
            console.error("Error playing jump scare sound:", error);
        }
    };

    const animateJumpScare = () => {
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / JUMP_SCARE_ANIMATION_DURATION, 1);
            
            // Exponential growth for more dramatic effect
            const size = progress * progress * progress * FINAL_JUMP_SCARE_SIZE;
            setJumpScareSize(size);

            if (progress < 1) {
                jumpScareAnimationRef.current = requestAnimationFrame(animate);
            }
        };

        jumpScareAnimationRef.current = requestAnimationFrame(animate);
    };

    const setupJumpScare = () => {
        jumpScareTimeoutRef.current = setTimeout(() => {
            startRecording();
            
            setTimeout(() => {
                setShowJumpScare(true);
                setJumpScareSize(0);
                stopBackgroundMusic();
                playJumpScareSound();
                animateJumpScare();
                
                setTimeout(() => {
                    setShowJumpScare(false);
                    stopRecording();
                    navigation.navigate("GameOver", { score, completed: false });
                }, JUMP_SCARE_DISPLAY_DURATION);
            }, 3000);
        }, JUMP_SCARE_TIME - 3000);
    };

    const setupDifficultyProgression = () => {
        difficultyTimerRef.current = setInterval(() => {
            setDifficultyMultiplier(prev => prev * (1 + DIFFICULTY_INCREASE_PERCENTAGE));
        }, DIFFICULTY_INCREASE_INTERVAL);
    };

    const getRandomAsteroidSpeed = () => {
        const baseSpeed = BASE_ASTEROID_SPEED * difficultyMultiplier;
        const variation = baseSpeed * 0.4;
        return baseSpeed + (Math.random() * variation - variation / 2);
    };

    const startGameLoop = () => {
        asteroidSpawnRef.current = setInterval(() => {
            const newAsteroid = {
                x: Math.random() * (Screen.mainScreen.widthDIPs - ASTEROID_WIDTH),
                y: -ASTEROID_WIDTH,
                speed: getRandomAsteroidSpeed()
            };
            setAsteroids(prev => [...prev, newAsteroid]);
        }, 1500);

        gameLoopRef.current = setInterval(() => {
            setAsteroids(prev => 
                prev.map(asteroid => ({
                    ...asteroid,
                    y: asteroid.y + asteroid.speed
                })).filter(asteroid => asteroid.y < Screen.mainScreen.heightDIPs)
            );
            setScore(prev => prev + 1);
        }, 33);
    };

    const moveLeft = () => {
        setSpaceshipX(prev => Math.max(0, prev - SPACESHIP_SPEED));
    };

    const moveRight = () => {
        setSpaceshipX(prev => Math.min(Screen.mainScreen.widthDIPs - SPACESHIP_WIDTH, prev + SPACESHIP_SPEED));
    };

    React.useEffect(() => {
        setupPermissions();
        startBackgroundMusic();
        startGameLoop();
        setupJumpScare();
        setupDifficultyProgression();

        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
            if (asteroidSpawnRef.current) clearInterval(asteroidSpawnRef.current);
            if (jumpScareTimeoutRef.current) clearTimeout(jumpScareTimeoutRef.current);
            if (difficultyTimerRef.current) clearInterval(difficultyTimerRef.current);
            if (jumpScareAnimationRef.current) cancelAnimationFrame(jumpScareAnimationRef.current);
            stopBackgroundMusic();
            stopRecording();
        };
    }, []);

    return (
        <absoluteLayout style={styles.container}>
            <image
                src="~/assets/images/game-background.jpg"
                stretch="aspectFill"
                style={styles.background}
            />
            
            <label 
                style={styles.score}
                horizontalAlignment="right"
                verticalAlignment="top"
            >
                {score}
            </label>

            {asteroids.map((asteroid, index) => (
                <image
                    key={index}
                    src="~/assets/images/asteroid.png"
                    style={{
                        width: ASTEROID_WIDTH,
                        height: ASTEROID_WIDTH,
                        left: asteroid.x,
                        top: asteroid.y,
                        position: "absolute"
                    }}
                />
            ))}

            <image
                src="~/assets/images/spaceship.png"
                style={{
                    width: SPACESHIP_WIDTH,
                    height: SPACESHIP_WIDTH,
                    left: spaceshipX,
                    top: Screen.mainScreen.heightDIPs - 400,
                    position: "absolute"
                }}
            />

            <gridLayout 
                columns="*, *" 
                style={{
                    width: "100%",
                    height: 200,
                    top: Screen.mainScreen.heightDIPs - 200,
                    position: "absolute"
                }}
            >
                <button 
                    text="" 
                    col={0}
                    onTap={moveLeft} 
                    style={styles.controlButton}
                />
                <button 
                    text="" 
                    col={1}
                    onTap={moveRight} 
                    style={styles.controlButton}
                />
            </gridLayout>

            {showJumpScare && (
                <image
                    src="~/assets/images/jumpscare.png"
                    stretch="aspectFill"
                    style={{
                        width: jumpScareSize,
                        height: jumpScareSize,
                        left: (Screen.mainScreen.widthDIPs - jumpScareSize) / 2,
                        top: (Screen.mainScreen.heightDIPs - jumpScareSize) / 2,
                        position: "absolute",
                        zIndex: 1000
                    }}
                />
            )}
        </absoluteLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%"
    },
    background: {
        width: "100%",
        height: "100%"
    },
    score: {
        fontSize: 32,
        color: "white",
        fontWeight: "bold",
        margin: 20,
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2
    },
    controlButton: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.2)"
    }
});

export { GameScreen }