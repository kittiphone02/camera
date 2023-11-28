'use client'
import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isCameraAvailable, setIsCameraAvailable] = useState<boolean>(true);
    const [isCameraAccessDenied, setIsCameraAccessDenied] = useState<boolean>(false);
    const [isFrontCamera, setIsFrontCamera] = useState<boolean>(true);

    useEffect(() => {
        const checkCameraAvailability = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach((track) => track.stop());
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter((device) => device.kind === 'videoinput');
                setIsCameraAvailable(videoDevices.length > 0);
            } catch (error: any) {
                console.error('Error checking camera availability:', error);
                setIsCameraAvailable(false);

                if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    setIsCameraAccessDenied(true);
                }
            }
        };

        checkCameraAvailability();
    }, []);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot() ?? null;
        setImageSrc(imageSrc);
        console.log(imageSrc);
    }, []);

    const switchCamera = useCallback(() => {
        setIsFrontCamera((prev) => !prev);
    }, []);

    return (
        <div>
            {isCameraAvailable ? (
                <>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: isFrontCamera ? 'user' : 'environment' }}
                        className="w-full h-screen  "
                    />
                    {/* Overlay text */}
                    <div className="absolute top-0 right-0 flex items-center justify-center">
                        <button onClick={switchCamera} className=" bottom-4 left-4 bg-gray-500 text-white px-4 py-2 rounded-full">Switch Camera</button>
                    </div>

                    {/* Your other UI elements go here */}

                    {/* ... other UI elements ... */}

                    {imageSrc && (
                        <div>
                            <h2>Captured Photo:</h2>
                            <img src={imageSrc} alt="captured" />
                        </div>
                    )}

                    <button
                        type="button"
                        className="rounded-full bg-white px-4 h-8 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Button text
                    </button>
                    <div className="fixed bottom-0 left-0 z-50 w-full h-32 bg-white border-t border-gray-200 ">
                        <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">

                            <div className="inline-flex flex-col items-center justify-center px-5  group">
                                <button
                                    type="button"
                                    className="rounded-full bg-white px-4 h-10  py-2.5 text-sm font-semibold text-blue-400 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-gray-400"
                                >
                                    Photos
                                </button>
                            </div>

                            <button  onClick={capture} type="button" className="inline-flex flex-col items-center justify-center px-5  group">
                                <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-100 ring-4">
                                    {/* Your camera icon or content goes here */}
                                </div>

                            </button>
                            <button type="button" className="inline-flex flex-col items-center justify-center px-5  group">
                                <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                </svg>
                                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Tip</span>
                            </button>
                        </div>
                    </div>

                </>
            ) : (
                <p>
                    {isCameraAccessDenied
                        ? 'Camera access denied. Please enable camera access in your browser settings.'
                        : 'Camera not available.'}
                </p>
            )}
        </div>
    );
};

export default WebcamCapture;
