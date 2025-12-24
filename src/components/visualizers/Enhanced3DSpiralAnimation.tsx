import React, { useEffect, useRef, useState, useCallback } from 'react';

interface SpiralParams {
  timeScale: number;
  helixRadius: number;
  helixPitch: number;
  particleCount: number;
  rotationSpeed: number;
  zoomLevel: number;
  particleSize: number;
  trailLength: number;
  glowIntensity: number;
}

interface VisibilityControls {
  showParticles: boolean;
  showTrails: boolean;
  showSpiralGrid: boolean;
  showRadialGrid: boolean;
  showCenterObject: boolean;
  showEnvelope: boolean;
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
  saturation: number;
  lightness: number;
  trail: Array<{ x: number; y: number; z: number; alpha: number }>;
}

const Enhanced3DSpiralAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const cameraRef = useRef({ 
    x: 0, 
    y: 0, 
    z: 600, 
    rotX: 0.3, 
    rotY: 0.3, 
    targetRotX: 0.3, 
    targetRotY: 0.3 
  });
  
  const [params, setParams] = useState<SpiralParams>({
    timeScale: 1.8,
    helixRadius: 180,
    helixPitch: 5,
    particleCount: 200,
    rotationSpeed: 1.0,
    zoomLevel: 1.3,
    particleSize: 4,
    trailLength: 30,
    glowIntensity: 1.2
  });

  const [visibility, setVisibility] = useState<VisibilityControls>({
    showParticles: true,
    showTrails: true,
    showSpiralGrid: true,
    showRadialGrid: true,
    showCenterObject: true,
    showEnvelope: true,
    showEquations: true
  });

  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  // 3D投影函数
  const project3D = (x: number, y: number, z: number, camera: any) => {
    const cosRotX = Math.cos(camera.rotX);
    const sinRotX = Math.sin(camera.rotX);
    const cosRotY = Math.cos(camera.rotY);
    const sinRotY = Math.sin(camera.rotY);
    
    // 旋转变换
    const rotatedX = x * cosRotY - z * sinRotY;
    const rotatedZ = x * sinRotY + z * cosRotY;
    const rotatedY = y * cosRotX - rotatedZ * sinRotX;
    const finalZ = y * sinRotX + rotatedZ * cosRotX;
    
    // 透视投影
    const distance = camera.z + finalZ;
    const scale = distance > 0 ? camera.z / distance : 0;
    
    return {
      x: rotatedX * scale,
      y: rotatedY * scale,
      scale: scale
    };
  };

  // 初始化粒子系统 - 严格按照螺旋方程
  const initializeParticles = useCallback(() => {
    const particles: Particle[] = [];
    
    for (let i = 0; i < params.particleCount; i++) {
      const t = (i / params.particleCount) * Math.PI * 8; // 参数t
      
      // 三维螺旋时空方程: r⃗(t) = R·cos(ωt + φ)î + R·sin(ωt + φ)ĵ + h·t·k̂
      const omega = 1; // 角频率
      const phi = 0;   // 相位
      const R = params.helixRadius; // 螺旋半径
      const h = params.helixPitch;  // 螺旋间距
      
      const x = R * Math.cos(omega * t + phi);
      const z = R * Math.sin(omega * t + phi);
      const y = h * t - 300; // 增加垂直分布范围
      
      // 生成更丰富的颜色变化
      const baseHue = (i * 360 / params.particleCount) % 360;
      const saturation = 70 + Math.random() * 30;
      const lightness = 50 + Math.random() * 20;
      
      particles.push({
        x, y, z,
        vx: 0, vy: 0, vz: 0,
        age: 0,
        maxAge: 1500 + Math.random() * 1000,
        size: params.particleSize + Math.random() * 2,
        hue: baseHue,
        saturation: saturation,
        lightness: lightness,
        trail: []
      });
    }
    
    particlesRef.current = particles;
  }, [params.particleCount, params.helixRadius, params.helixPitch]);

  // 更新粒子位置 - 基于时空同一化方程
  const updateParticles = useCallback(() => {
    const dt = 0.025 * params.timeScale;
    timeRef.current += dt;
    
    particlesRef.current.forEach((particle, i) => {
      const t = timeRef.current * 0.5 + (i / params.particleCount) * Math.PI * 8;
      
      // 时空同一化方程影响: ds² = c²dt² - dx² - dy² - dz²
      // 在这里体现为时空扭曲效应
      const spacetimeWarp = Math.sin(t * 0.8) * 0.1;
      
      // 三维螺旋时空方程
      const omega = params.rotationSpeed;
      const R = params.helixRadius * (1 + spacetimeWarp);
      const h = params.helixPitch;
      
      particle.x = R * Math.cos(omega * t);
      particle.z = R * Math.sin(omega * t);
      particle.y = (h * t) % 400 - 200;
      
      // 更新轨迹 - 使用参数控制长度
      particle.trail.unshift({
        x: particle.x,
        y: particle.y,
        z: particle.z,
        alpha: 1.0
      });
      
      if (particle.trail.length > params.trailLength) {
        particle.trail.pop();
      }
      
      particle.trail.forEach((point, index) => {
        point.alpha = 1 - (index / particle.trail.length);
      });
      
      particle.age += dt;
      particle.hue = (particle.hue + dt * 50) % 360;
    });
  }, [params]);

  // 渲染函数
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 清空画布
    ctx.fillStyle = 'rgba(5, 5, 15, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // 绘制背景渐变 - 添加动态星空效果
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
    gradient.addColorStop(0, 'rgba(15, 10, 40, 0.9)');
    gradient.addColorStop(0.5, 'rgba(5, 5, 20, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 10, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 绘制星空背景
    if (Math.random() < 0.1) { // 减少绘制频率以提高性能
      for (let i = 0; i < 10; i++) {
        const starX = Math.random() * width;
        const starY = Math.random() * height;
        const starSize = Math.random() * 2;
        const starAlpha = Math.random() * 0.8 + 0.2;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
        ctx.beginPath();
        ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 绘制螺旋包络线
    if (visibility.showEnvelope) {
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.4)';
      ctx.lineWidth = 2;
      
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
    }

    // 绘制螺旋网格
    if (visibility.showSpiralGrid) {
      for (let layer = 0; layer < 6; layer++) {
        const layerRadius = 50 + layer * 25;
        const layerAlpha = 0.5 - layer * 0.06;
        const layerHue = (timeRef.current * 50 + layer * 45) % 360;
        
        ctx.strokeStyle = `hsla(${layerHue}, 70%, 60%, ${layerAlpha})`;
        ctx.lineWidth = 2 - layer * 0.2;
        
        const points = [];
        for (let i = 0; i <= 64; i++) {
          const angle = (i / 64) * Math.PI * 2 + timeRef.current * (0.5 + layer * 0.1);
          const x = layerRadius * Math.cos(angle);
          const z = layerRadius * Math.sin(angle);
          const y = Math.sin(angle * 3 + timeRef.current * 2) * 20;
          
          const projected = project3D(x, y, z, cameraRef.current);
          if (projected.scale > 0.1) {
            const screenX = centerX + projected.x * params.zoomLevel;
            const screenY = centerY + projected.y * params.zoomLevel;
            points.push({ x: screenX, y: screenY });
          }
        }
        
        if (points.length > 0) {
          ctx.beginPath();
          points.forEach((point, index) => {
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

    // 绘制径向网格
    if (visibility.showRadialGrid) {
      ctx.strokeStyle = 'rgba(100, 150, 200, 0.3)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
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
    }

    // 绘制中心物体
    if (visibility.showCenterObject) {
      const centralObject = project3D(0, 0, 0, cameraRef.current);
      if (centralObject.scale > 0) {
        const pulsation = Math.sin(timeRef.current * 4) * 0.4 + 1;
        const size = Math.max(1, 30 * pulsation * centralObject.scale * params.zoomLevel);
        const centerObjX = centerX + centralObject.x * params.zoomLevel;
        const centerObjY = centerY + centralObject.y * params.zoomLevel;
        
        // 能量环
        for (let ring = 0; ring < 3; ring++) {
          const ringSize = Math.max(1, size * (2 + ring * 0.8));
          const ringAlpha = (Math.sin(timeRef.current * 5 + ring * 1.5) * 0.3 + 0.4) * (1 - ring * 0.2);
          const ringHue = (timeRef.current * 100 + ring * 90) % 360;
          
          ctx.strokeStyle = `hsla(${ringHue}, 90%, 60%, ${ringAlpha})`;
          ctx.lineWidth = Math.max(1, 4 - ring);
          ctx.beginPath();
          ctx.arc(centerObjX, centerObjY, ringSize, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // 主球体
        const ballGradient = ctx.createRadialGradient(
          centerObjX - size * 0.3, centerObjY - size * 0.3, 0,
          centerObjX, centerObjY, size
        );
        const coreHue = (timeRef.current * 80) % 360;
        ballGradient.addColorStop(0, `hsl(${coreHue}, 100%, 90%)`);
        ballGradient.addColorStop(0.5, `hsl(${(coreHue + 120) % 360}, 80%, 50%)`);
        ballGradient.addColorStop(1, `hsl(${(coreHue + 240) % 360}, 60%, 10%)`);
        
        ctx.fillStyle = ballGradient;
        ctx.beginPath();
        ctx.arc(centerObjX, centerObjY, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 绘制粒子轨迹
    if (visibility.showTrails) {
      particlesRef.current.forEach(particle => {
        if (particle.trail.length > 1) {
          ctx.strokeStyle = `hsla(${particle.hue}, 80%, 60%, 0.6)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          particle.trail.forEach((point, index) => {
            const projected = project3D(point.x, point.y, point.z, cameraRef.current);
            if (projected.scale > 0.1) {
              const screenX = centerX + projected.x * params.zoomLevel;
              const screenY = centerY + projected.y * params.zoomLevel;
              
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
    }

    // 绘制粒子
    if (visibility.showParticles) {
      const sortedParticles = particlesRef.current
        .map(particle => ({
          particle,
          projected: project3D(particle.x, particle.y, particle.z, cameraRef.current)
        }))
        .filter(({ projected }) => projected.scale > 0)
        .sort((a, b) => a.projected.scale - b.projected.scale);

      sortedParticles.forEach(({ particle, projected }) => {
        const screenX = centerX + projected.x * params.zoomLevel;
        const screenY = centerY + projected.y * params.zoomLevel;
        const size = Math.max(1, particle.size * projected.scale * params.zoomLevel);
        
        // 粒子光晕 - 增强发光效果
        const glowFactor = params.glowIntensity;
        const particleGradient = ctx.createRadialGradient(
          screenX, screenY, 0,
          screenX, screenY, size * 3 * glowFactor
        );
        particleGradient.addColorStop(0, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness + 30}%, 0.9)`);
        particleGradient.addColorStop(0.3, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, 0.5)`);
        particleGradient.addColorStop(1, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness - 20}%, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 粒子核心 - 添加高光效果
        ctx.fillStyle = `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness + 40}%, 1)`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加粒子高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(screenX - size * 0.3, screenY - size * 0.3, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 绘制方程式 - 增强视觉效果
    if (visibility.showEquations) {
      // 方程背景板
      const bgGradient = ctx.createLinearGradient(0, 20, 0, 80);
      bgGradient.addColorStop(0, 'rgba(138, 43, 226, 0.2)');
      bgGradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(centerX - 400, 10, 800, 80);
      
      // 方程文字
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = 'bold 28px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#8a2be2';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.fillText('时空同一化方程: ds² = c²dt² - dx² - dy² - dz²', centerX, 40);
      ctx.fillText('三维螺旋时空方程: r⃗(t) = R·cos(ωt + φ)î + R·sin(ωt + φ)ĵ + h·t·k̂', centerX, 80);
      
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  }, [params, visibility]);

  // 动画循环
  const animate = useCallback(() => {
    updateParticles();
    render();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, render]);

  // 鼠标控制
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseRef.current.isDown = true;
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseRef.current.isDown) return;
    
    const deltaX = e.clientX - mouseRef.current.x;
    const deltaY = e.clientY - mouseRef.current.y;
    
    cameraRef.current.targetRotY += deltaX * 0.01;
    cameraRef.current.targetRotX += deltaY * 0.01;
    
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  };

  const handleMouseUp = () => {
    mouseRef.current.isDown = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1.1 : 0.9;
    setParams(prev => ({
      ...prev,
      zoomLevel: Math.max(0.1, Math.min(3, prev.zoomLevel * delta))
    }));
  };

  // 初始化和清理
  useEffect(() => {
    initializeParticles();
  }, [initializeParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 增大canvas尺寸以提高可视化效果
    canvas.width = 1600;
    canvas.height = 1200;
    
    // 相机平滑移动
    const updateCamera = () => {
      cameraRef.current.rotX += (cameraRef.current.targetRotX - cameraRef.current.rotX) * 0.1;
      cameraRef.current.rotY += (cameraRef.current.targetRotY - cameraRef.current.rotY) * 0.1;
    };
    
    const smoothCameraUpdate = setInterval(updateCamera, 16);
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearInterval(smoothCameraUpdate);
    };
  }, [animate]);

  return (
    <div className="w-full h-full overflow-hidden bg-black rounded-lg">
      <div className="flex flex-col h-full lg:flex-row">
        {/* 控制面板 */}
        <div className="p-4 overflow-y-auto bg-gray-900 lg:w-80">
          <h3 className="mb-4 text-lg font-bold text-white">🌌 螺旋时空控制</h3>
          
          {/* 物理参数 */}
          <div className="mb-6">
              <h4 className="mb-2 font-semibold text-blue-300">📐 物理参数</h4>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm text-white">时间流速: {params.timeScale.toFixed(1)}x</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={params.timeScale}
                  onChange={(e) => setParams(prev => ({ ...prev, timeScale: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm text-white">螺旋半径: {params.helixRadius}</label>
                <input
                  type="range"
                  min="100"
                  max="300"
                  value={params.helixRadius}
                  onChange={(e) => setParams(prev => ({ ...prev, helixRadius: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm text-white">螺旋间距: {params.helixPitch.toFixed(1)}</label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={params.helixPitch}
                  onChange={(e) => setParams(prev => ({ ...prev, helixPitch: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm text-white">粒子数量: {params.particleCount}</label>
                <input
                  type="range"
                  min="100"
                  max="300"
                  value={params.particleCount}
                  onChange={(e) => setParams(prev => ({ ...prev, particleCount: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm text-white">旋转速度: {params.rotationSpeed.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={params.rotationSpeed}
                  onChange={(e) => setParams(prev => ({ ...prev, rotationSpeed: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* 视觉效果参数 */}
            <div className="mb-6">
              <h4 className="mb-2 font-semibold text-purple-300">✨ 视觉效果</h4>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm text-white">粒子大小: {params.particleSize.toFixed(1)}</label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="0.5"
                  value={params.particleSize}
                  onChange={(e) => setParams(prev => ({ ...prev, particleSize: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm text-white">轨迹长度: {params.trailLength}</label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={params.trailLength}
                  onChange={(e) => setParams(prev => ({ ...prev, trailLength: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-3">
                <label className="block mb-1 text-sm text-white">光晕强度: {params.glowIntensity.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={params.glowIntensity}
                  onChange={(e) => setParams(prev => ({ ...prev, glowIntensity: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>

          {/* 可见性控制 */}
          <div className="mb-6">
            <h4 className="mb-2 font-semibold text-green-300">👁️ 显示控制</h4>
            
            {Object.entries(visibility).map(([key, value]) => (
              <div key={key} className="mb-2">
                <label className="flex items-center text-sm text-white">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setVisibility(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="mr-2"
                  />
                  {key === 'showParticles' && '✨ 粒子'}
                  {key === 'showTrails' && '🌀 轨迹'}
                  {key === 'showSpiralGrid' && '🕸️ 螺旋网格'}
                  {key === 'showRadialGrid' && '📐 径向网格'}
                  {key === 'showCenterObject' && '⭐ 中心物体'}
                  {key === 'showEnvelope' && '📦 包络线'}
                  {key === 'showEquations' && '📚 方程式'}
                </label>
              </div>
            ))}
          </div>

          {/* 操作说明 */}
          <div className="text-xs text-gray-400">
            <p>🖱️ 拖拽旋转视角</p>
            <p>🔄 滚轮缩放</p>
            <p>⚡ 实时物理模拟</p>
          </div>
        </div>

        {/* 动画画布 */}
        <div className="flex items-center justify-center flex-1 bg-black overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            className="border border-gray-700 cursor-grab active:cursor-grabbing transition-transform duration-300 ease-out"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Enhanced3DSpiralAnimation;