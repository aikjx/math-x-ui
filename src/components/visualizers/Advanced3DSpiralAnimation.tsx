import React, { useEffect, useRef, useState, useCallback } from 'react';

interface SpiralParams {
  timeScale: number;
  helixRadius: number;
  helixPitch: number;
  particleCount: number;
  rotationSpeed: number;
  zoomLevel: number;
}

interface VisibilityControls {
  showParticles: boolean;
  showTrails: boolean;
  showSpiralGrid: boolean;
  showRadialGrid: boolean;
  showCenterObject: boolean;
  showEnvelope: boolean;
  showBoundary: boolean;
  showEquations: boolean;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  age: number;
  maxAge: number;
  size: number;
  hue: number;
  trail: Array<{ x: number; y: number; z: number; alpha: number }>;
}

const Advanced3DSpiralAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const cameraRef = useRef({ 
    x: 0, 
    y: 0, 
    z: 500, 
    rotX: 0, 
    rotY: 0, 
    targetRotX: 0, 
    targetRotY: 0 
  });
  
  const [params, setParams] = useState<SpiralParams>({
    timeScale: 2.0,
    helixRadius: 120,
    helixPitch: 4,
    particleCount: 120,
    rotationSpeed: 1.2,
    zoomLevel: 1.0
  });

  const [visibility, setVisibility] = useState<VisibilityControls>({
    showParticles: true,
    showTrails: true,
    showSpiralGrid: true,
    showRadialGrid: true,
    showCenterObject: true,
    showEnvelope: true,
    showBoundary: true,
    showEquations: true
  });

  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  // 初始化粒子系统
  const initParticles = useCallback(() => {
    particlesRef.current = Array.from({ length: params.particleCount }, (_, i) => ({
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      age: 0,
      maxAge: 200 + Math.random() * 100,
      size: 2 + Math.random() * 4,
      hue: (i / params.particleCount) * 360,
      trail: []
    }));
  }, [params.particleCount]);

  // 3D投影函数
  const project3D = (x: number, y: number, z: number, camera: any) => {
    // 应用相机旋转
    const cosX = Math.cos(camera.rotX);
    const sinX = Math.sin(camera.rotX);
    const cosY = Math.cos(camera.rotY);
    const sinY = Math.sin(camera.rotY);

    // 旋转变换
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    const y1 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX + camera.z;

    // 透视投影
    const perspective = 800 / (800 + z2);
    return {
      x: x1 * perspective,
      y: y1 * perspective,
      z: z2,
      scale: perspective
    };
  };

  // 鼠标交互
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;

    if (mouseRef.current.isDown) {
      const deltaX = (e.movementX || 0) * 0.01;
      const deltaY = (e.movementY || 0) * 0.01;
      
      cameraRef.current.targetRotY += deltaX;
      cameraRef.current.targetRotX += deltaY;
      
      // 限制垂直旋转
      cameraRef.current.targetRotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraRef.current.targetRotX));
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    mouseRef.current.isDown = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * 0.001;
    cameraRef.current.z += delta * 100;
    cameraRef.current.z = Math.max(200, Math.min(1000, cameraRef.current.z));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleWheel]);

  useEffect(() => {
    initParticles();
  }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // 清空画布，创建深空背景
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
      gradient.addColorStop(0, '#0a0a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f0f23');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // 平滑相机旋转
      cameraRef.current.rotX += (cameraRef.current.targetRotX - cameraRef.current.rotX) * 0.1;
      cameraRef.current.rotY += (cameraRef.current.targetRotY - cameraRef.current.rotY) * 0.1;
      
      timeRef.current += 0.025 * params.timeScale;
      
      // 更新粒子位置
      particlesRef.current.forEach((particle, i) => {
        const phase = (i / params.particleCount) * Math.PI * 2;
        const t = timeRef.current + phase;
        
        // 三维螺旋时空方程 - 超级增强版
        const baseRadius = params.helixRadius * (0.7 + 0.5 * Math.sin(t * 0.4 + i * 0.1));
        
        // 多重螺旋效果
        const spiralLayer = Math.floor(i / 20) % 3;
        const layerOffset = spiralLayer * Math.PI * 0.67;
        
        const x = baseRadius * Math.cos(t * params.rotationSpeed + layerOffset);
        const z = baseRadius * Math.sin(t * params.rotationSpeed + layerOffset);
        const y = (t * params.helixPitch * 12 + spiralLayer * 100) % 600 - 300;
        
        // 增强时空扭曲效果
        const waveDistortion = Math.sin(t * 1.2 + i * 0.3) * 25;
        const pulseDistortion = Math.cos(t * 2.5 + i * 0.2) * 15;
        const chaosDistortion = Math.sin(t * 3.7 + i * 0.15) * Math.cos(t * 1.8) * 10;
        
        particle.x = x + waveDistortion + Math.cos(t * 2.2 + i * 0.1) * pulseDistortion;
        particle.y = y + Math.sin(t * 1.8 + i * 0.2) * waveDistortion * 0.6 + chaosDistortion;
        particle.z = z + Math.sin(t * 2.8 + i * 0.25) * pulseDistortion + Math.cos(t * 1.5) * chaosDistortion;
        
        // 更新轨迹 - 增加轨迹长度
        particle.trail.unshift({
          x: particle.x,
          y: particle.y,
          z: particle.z,
          alpha: 1.0
        });
        
        // 限制轨迹长度 - 更长的轨迹
        if (particle.trail.length > 25) {
          particle.trail.pop();
        }
        
        // 更新轨迹透明度
        particle.trail.forEach((point, index) => {
          point.alpha = 1 - (index / particle.trail.length);
        });
        
        // 更新粒子属性
        particle.age++;
        particle.hue = (particle.hue + 1.5 + Math.sin(t * 0.5) * 0.5) % 360;
        particle.size = 2 + Math.sin(t + i) * 3 + Math.cos(t * 2 + i * 0.3) * 1.5;
      });
      
      // 绘制增强的3D时空网格
      
      // 动态网格颜色
      const gridHue = (timeRef.current * 30) % 360;
      ctx.strokeStyle = `hsla(${gridHue}, 70%, 50%, 0.4)`;
      ctx.lineWidth = 1.5;
      
      // 绘制多层螺旋网格线 - 更多层次 (可控制显示)
      if (visibility.showSpiralGrid) {
      for (let layer = 0; layer < 8; layer++) {
        const radius = 30 + layer * 35;
        const layerHue = (gridHue + layer * 45) % 360;
        ctx.strokeStyle = `hsla(${layerHue}, 60%, 45%, ${0.6 - layer * 0.05})`;
        
        const points = [];
        
        for (let angle = 0; angle <= Math.PI * 6; angle += 0.08) {
          const x = radius * Math.cos(angle + timeRef.current * 0.2);
          const z = radius * Math.sin(angle + timeRef.current * 0.2);
          const y = (angle * 25 + Math.sin(timeRef.current + layer) * 50) % 500 - 250;
          
          const projected = project3D(x, y, z, cameraRef.current);
          points.push({
            x: centerX + projected.x * params.zoomLevel,
            y: centerY + projected.y * params.zoomLevel,
            scale: projected.scale
          });
        }
        
        ctx.beginPath();
        points.forEach((point, index) => {
          if (point.scale > 0.1) {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
        });
        ctx.stroke();
      }
      
      // 添加脉冲环效果
      for (let ring = 0; ring < 5; ring++) {
        const ringRadius = 80 + ring * 60;
        const ringAlpha = Math.sin(timeRef.current * 2 + ring) * 0.3 + 0.4;
        const ringHue = (timeRef.current * 50 + ring * 72) % 360;
        
        ctx.strokeStyle = `hsla(${ringHue}, 80%, 60%, ${ringAlpha})`;
        ctx.lineWidth = 3;
        
        const ringPoints = [];
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
          const x = ringRadius * Math.cos(angle);
          const z = ringRadius * Math.sin(angle);
          const y = Math.sin(timeRef.current * 3 + ring) * 30;
          
          const projected = project3D(x, y, z, cameraRef.current);
          if (projected.scale > 0.1) {
            ringPoints.push({
              x: centerX + projected.x * params.zoomLevel,
              y: centerY + projected.y * params.zoomLevel
            });
          }
        }
        
        if (ringPoints.length > 0) {
          ctx.beginPath();
          ringPoints.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.closePath();
          ctx.stroke();
        }
      }
      }
      
      // 绘制螺旋连接包络线
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.4)';
      ctx.lineWidth = 2;
      
      // 上下螺旋包络
      for (let envelope = 0; envelope < 2; envelope++) {
        const yOffset = envelope === 0 ? -150 : 150;
        ctx.beginPath();
        let firstPoint = true;
        
        for (let angle = 0; angle <= Math.PI * 6; angle += 0.1) {
          const radius = params.helixRadius * (1 + Math.sin(angle * 0.3) * 0.2);
          const x = radius * Math.cos(angle + timeRef.current * params.rotationSpeed);
          const z = radius * Math.sin(angle + timeRef.current * params.rotationSpeed);
          const y = yOffset;
          
          const projected = project3D(x, y, z, cameraRef.current);
          if (projected.scale > 0.1) {
            const screenX = centerX + projected.x * params.zoomLevel;
            const screenY = centerY + projected.y * params.zoomLevel;
            
            if (firstPoint) {
              ctx.moveTo(screenX, screenY);
              firstPoint = false;
            } else {
              ctx.lineTo(screenX, screenY);
            }
          }
        }
        ctx.stroke();
      }
      


      // 绘制径向网格
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        ctx.beginPath();
        
        for (let r = 0; r <= 200; r += 20) {
          const x = r * Math.cos(angle);
          const z = r * Math.sin(angle);
          const y = 0;
          
          const projected = project3D(x, y, z, cameraRef.current);
          const screenX = centerX + projected.x * params.zoomLevel;
          const screenY = centerY + projected.y * params.zoomLevel;
          
          if (projected.scale > 0.1) {
            if (r === 0) {
              ctx.moveTo(screenX, screenY);
            } else {
              ctx.lineTo(screenX, screenY);
            }
          }
        }
        ctx.stroke();
      }
      
      // 绘制超级增强的中心物体
      const centralObject = project3D(0, 0, 0, cameraRef.current);
      if (centralObject.scale > 0) {
        const pulsation = Math.sin(timeRef.current * 4) * 0.4 + 1;
        const size = 30 * pulsation * centralObject.scale * params.zoomLevel;
        const centerObjX = centerX + centralObject.x * params.zoomLevel;
        const centerObjY = centerY + centralObject.y * params.zoomLevel;
        
        // 确保 size 为正数
        const safeSize = Math.max(1, Math.abs(size));
        
        // 外层能量环 (修复负半径问题)
        for (let ring = 0; ring < 4; ring++) {
          const ringSize = Math.max(1, safeSize * (2 + ring * 0.8));
          const ringAlpha = (Math.sin(timeRef.current * 5 + ring * 1.5) * 0.3 + 0.4) * (1 - ring * 0.2);
          const ringHue = (timeRef.current * 100 + ring * 90) % 360;
          
          ctx.strokeStyle = `hsla(${ringHue}, 90%, 60%, ${ringAlpha})`;
          ctx.lineWidth = Math.max(1, 4 - ring);
          ctx.beginPath();
          ctx.arc(centerObjX, centerObjY, ringSize, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // 能量闪电效果
        if (Math.random() < 0.3) {
          for (let lightning = 0; lightning < 8; lightning++) {
            const angle = (lightning / 8) * Math.PI * 2 + timeRef.current;
            const length = safeSize * (2 + Math.random() * 3);
            const endX = centerObjX + Math.cos(angle) * length;
            const endY = centerObjY + Math.sin(angle) * length;
            
            ctx.strokeStyle = `hsla(${200 + Math.random() * 160}, 100%, 80%, 0.8)`;
            ctx.lineWidth = 2 + Math.random() * 3;
            ctx.beginPath();
            ctx.moveTo(centerObjX, centerObjY);
            
            // 闪电锯齿效果
            const segments = 5;
            for (let seg = 1; seg <= segments; seg++) {
              const segX = centerObjX + (endX - centerObjX) * (seg / segments) + (Math.random() - 0.5) * 20;
              const segY = centerObjY + (endY - centerObjY) * (seg / segments) + (Math.random() - 0.5) * 20;
              ctx.lineTo(segX, segY);
            }
            ctx.stroke();
          }
        }
        
        // 主球体 - 多层渐变 (修复负半径问题)
        const ballGradient = ctx.createRadialGradient(
          centerObjX - safeSize * 0.3,
          centerObjY - safeSize * 0.3,
          0,
          centerObjX,
          centerObjY,
          safeSize
        );
        const coreHue = (timeRef.current * 80) % 360;
        ballGradient.addColorStop(0, `hsl(${coreHue}, 100%, 90%)`);
        ballGradient.addColorStop(0.2, `hsl(${(coreHue + 60) % 360}, 90%, 70%)`);
        ballGradient.addColorStop(0.5, `hsl(${(coreHue + 120) % 360}, 80%, 50%)`);
        ballGradient.addColorStop(0.8, `hsl(${(coreHue + 180) % 360}, 70%, 30%)`);
        ballGradient.addColorStop(1, `hsl(${(coreHue + 240) % 360}, 60%, 10%)`);
        
        ctx.fillStyle = ballGradient;
        ctx.shadowColor = `hsl(${coreHue}, 100%, 60%)`;
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.arc(centerObjX, centerObjY, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // 核心高亮 (修复负半径问题)
        const highlightRadius = Math.max(1, safeSize * 0.3);
        ctx.fillStyle = `hsla(${coreHue}, 100%, 95%, 0.9)`;
        ctx.beginPath();
        ctx.arc(centerObjX - safeSize * 0.2, centerObjY - safeSize * 0.2, highlightRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 按深度排序粒子
      const sortedParticles = [...particlesRef.current]
        .map((particle, index) => ({
          particle,
          index,
          projected: project3D(particle.x, particle.y, particle.z, cameraRef.current)
        }))
        .filter(item => item.projected.scale > 0.05)
        .sort((a, b) => b.projected.z - a.projected.z);
      
      // 绘制粒子轨迹
      sortedParticles.forEach(({ particle, projected }) => {
        if (particle.trail.length > 1) {
          ctx.strokeStyle = `hsla(${particle.hue}, 80%, 60%, 0.6)`;
          ctx.lineWidth = 2 * projected.scale;
          ctx.beginPath();
          
          particle.trail.forEach((point, index) => {
            const trailProjected = project3D(point.x, point.y, point.z, cameraRef.current);
            if (trailProjected.scale > 0.05) {
              const screenX = centerX + trailProjected.x * params.zoomLevel;
              const screenY = centerY + trailProjected.y * params.zoomLevel;
              
              if (index === 0) {
                ctx.moveTo(screenX, screenY);
              } else {
                ctx.lineTo(screenX, screenY);
              }
            }
          });
          ctx.stroke();
        }
      });
      
      // 绘制螺旋连接线包络
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
      ctx.lineWidth = 1;
      
      // 上下螺旋包络线
      for (let envelope = 0; envelope < 2; envelope++) {
        const isTop = envelope === 0;
        const yOffset = isTop ? -200 : 200;
        
        ctx.beginPath();
        let firstPoint = true;
        
        for (let angle = 0; angle <= Math.PI * 8; angle += 0.1) {
          const radius = params.helixRadius * (1 + Math.sin(angle * 0.5) * 0.3);
          const x = radius * Math.cos(angle + timeRef.current * params.rotationSpeed);
          const z = radius * Math.sin(angle + timeRef.current * params.rotationSpeed);
          const y = yOffset + angle * params.helixPitch * 5;
          
          const projected = project3D(x, y, z, cameraRef.current);
          if (projected.scale > 0.1) {
            const screenX = centerX + projected.x * params.zoomLevel;
            const screenY = centerY + projected.y * params.zoomLevel;
            
            if (firstPoint) {
              ctx.moveTo(screenX, screenY);
              firstPoint = false;
            } else {
              ctx.lineTo(screenX, screenY);
            }
          }
        }
        ctx.stroke();
      }
      

      
      // 螺旋边界包络面
      ctx.strokeStyle = 'rgba(255, 150, 100, 0.4)';
      ctx.lineWidth = 1.5;
      
      for (let layer = 0; layer < 3; layer++) {
        const layerRadius = params.helixRadius * (0.8 + layer * 0.4);
        const layerAlpha = 0.4 - layer * 0.1;
        
        ctx.strokeStyle = `rgba(255, ${150 - layer * 30}, ${100 + layer * 50}, ${layerAlpha})`;
        ctx.beginPath();
        
        let firstPoint = true;
        for (let t = 0; t <= Math.PI * 6; t += 0.05) {
          const angle = t + timeRef.current * params.rotationSpeed;
          const x = layerRadius * Math.cos(angle);
          const z = layerRadius * Math.sin(angle);
          const y = (t / (Math.PI * 6) - 0.5) * 400; // 从-200到200
          
          const projected = project3D(x, y, z, cameraRef.current);
          if (projected.scale > 0.1) {
            const screenX = centerX + projected.x * params.zoomLevel;
            const screenY = centerY + projected.y * params.zoomLevel;
            
            if (firstPoint) {
              ctx.moveTo(screenX, screenY);
              firstPoint = false;
            } else {
              ctx.lineTo(screenX, screenY);
            }
          }
        }
        ctx.stroke();
      }

      // 绘制超级增强粒子
      sortedParticles.forEach(({ particle, projected }) => {
        const screenX = centerX + projected.x * params.zoomLevel;
        const screenY = centerY + projected.y * params.zoomLevel;
        const size = particle.size * projected.scale * params.zoomLevel;
        const safeParticleSize = Math.max(1, Math.abs(size));
        
        // 多层光晕效果 (修复负半径问题)
        for (let layer = 0; layer < 3; layer++) {
          const layerSize = Math.max(1, safeParticleSize * (3 - layer));
          const layerAlpha = 0.4 / (layer + 1);
          const layerHue = (particle.hue + layer * 30) % 360;
          
          const particleGradient = ctx.createRadialGradient(
            screenX, screenY, 0,
            screenX, screenY, layerSize
          );
          particleGradient.addColorStop(0, `hsla(${layerHue}, 100%, 80%, ${layerAlpha})`);
          particleGradient.addColorStop(0.3, `hsla(${layerHue}, 90%, 60%, ${layerAlpha * 0.7})`);
          particleGradient.addColorStop(0.7, `hsla(${layerHue}, 70%, 40%, ${layerAlpha * 0.3})`);
          particleGradient.addColorStop(1, `hsla(${layerHue}, 50%, 20%, 0)`);
          
          ctx.fillStyle = particleGradient;
          ctx.beginPath();
          ctx.arc(screenX, screenY, layerSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // 粒子闪烁效果 (修复负半径问题)
        if (Math.random() < 0.1) {
          const sparkleRadius = Math.max(1, safeParticleSize * 1.5);
          ctx.strokeStyle = `hsla(${particle.hue}, 100%, 90%, 0.8)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(screenX, screenY, sparkleRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // 绘制粒子核心 - 多层 (修复负半径问题)
        const coreGradient = ctx.createRadialGradient(
          screenX - safeParticleSize * 0.3, screenY - safeParticleSize * 0.3, 0,
          screenX, screenY, safeParticleSize
        );
        coreGradient.addColorStop(0, `hsla(${particle.hue}, 100%, 95%, 1)`);
        coreGradient.addColorStop(0.5, `hsla(${particle.hue}, 90%, 75%, 0.9)`);
        coreGradient.addColorStop(1, `hsla(${particle.hue}, 80%, 55%, 0.8)`);
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, safeParticleSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 核心高亮点 (修复负半径问题)
        const highlightSize = Math.max(0.5, safeParticleSize * 0.3);
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 98%, 0.9)`;
        ctx.beginPath();
        ctx.arc(screenX - safeParticleSize * 0.2, screenY - safeParticleSize * 0.2, highlightSize, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // 绘制方程式 - 3D风格
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 18px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#8a2be2';
      ctx.shadowBlur = 10;
      ctx.fillText('时空同一化方程: ds² = c²dt² - dx² - dy² - dz²', centerX, 50);
      
      ctx.font = 'bold 16px "Courier New", monospace';
      ctx.fillText('三维螺旋时空: r⃗(t) = R·cos(ωt + φ)î + R·sin(ωt + φ)ĵ + h·t·k̂', centerX, 80);
      ctx.shadowBlur = 0;
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [params]);

  const updateParam = (key: keyof SpiralParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="overflow-hidden relative w-full h-full bg-gradient-to-b from-black to-black via-purple-900/30">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ background: 'transparent' }}
      />
      
      {/* 高级控制面板 */}
      <div className="absolute top-4 left-4 p-6 max-w-sm text-white rounded-xl border backdrop-blur-md bg-black/90 border-purple-500/30">
        <h3 className="mb-4 text-xl font-bold text-purple-300">🌌 3D时空控制台</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-purple-200">
              时间流速: {params.timeScale.toFixed(2)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={params.timeScale}
              onChange={(e) => updateParam('timeScale', parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm text-purple-200">
              螺旋半径: {params.helixRadius.toFixed(0)}
            </label>
            <input
              type="range"
              min="60"
              max="200"
              step="10"
              value={params.helixRadius}
              onChange={(e) => updateParam('helixRadius', parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm text-purple-200">
              螺旋密度: {params.helixPitch.toFixed(1)}
            </label>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={params.helixPitch}
              onChange={(e) => updateParam('helixPitch', parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm text-purple-200">
              粒子数量: {params.particleCount}
            </label>
            <input
              type="range"
              min="50"
              max="200"
              step="10"
              value={params.particleCount}
              onChange={(e) => updateParam('particleCount', parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm text-purple-200">
              旋转速度: {params.rotationSpeed.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={params.rotationSpeed}
              onChange={(e) => updateParam('rotationSpeed', parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm text-purple-200">
              缩放级别: {params.zoomLevel.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={params.zoomLevel}
              onChange={(e) => updateParam('zoomLevel', parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
      
      {/* 操作指南 */}
      <div className="absolute right-4 bottom-4 p-4 text-white rounded-xl border backdrop-blur-md bg-black/90 border-purple-500/30">
        <h4 className="mb-2 text-lg font-bold text-purple-300">🎮 操作指南</h4>
        <div className="space-y-1 text-sm text-purple-200">
          <p>🖱️ 拖拽旋转视角</p>
          <p>🎡 滚轮缩放距离</p>
          <p>⚡ 实时参数调节</p>
          <p>🌀 3D螺旋时空可视化</p>
        </div>
      </div>
      
      {/* 性能指示器 */}
      <div className="absolute top-4 right-4 p-3 text-white rounded-xl border backdrop-blur-md bg-black/90 border-green-500/30">
        <div className="text-sm text-green-300">
          <p>🚀 高性能3D渲染</p>
          <p>📊 实时物理模拟</p>
          <p>🎯 60FPS流畅动画</p>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #a855f7);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #a855f7);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Advanced3DSpiralAnimation;