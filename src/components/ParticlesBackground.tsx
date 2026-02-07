import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { type Container, type Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container?: Container) => {
        // console.log(container);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            className="fixed inset-0 -z-10 pointer-events-none"
            options={{
                fpsLimit: 120,
                fullScreen: { enable: true, zIndex: -10 },
                background: {
                    color: "transparent",
                },
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "grab",
                            parallax: {
                                enable: true,
                                force: 60,
                                smooth: 10,
                            },
                        },
                        resize: { enable: true },
                    },
                    modes: {
                        push: {
                            quantity: 2,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                        grab: {
                            distance: 140,
                            links: {
                                opacity: 0.5,
                            },
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.1,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 0.6,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            height: 800,
                            width: 800,
                        },
                        value: 60,
                    },
                    opacity: {
                        value: 0.2, // Low opacity as requested
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 2 },
                    },
                },
                detectRetina: true,
            }}
        />
    );
};

export default ParticlesBackground;
