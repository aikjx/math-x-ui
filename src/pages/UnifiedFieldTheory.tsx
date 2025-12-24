import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Enhanced3DSpiralAnimation from '@/components/visualizers/Enhanced3DSpiralAnimation';
import FixedMathFormula from '@/components/FixedMathFormula';

// 扩展 Window 接口
declare global {
  interface Window {
    MathJax?: any;
  }
}

const UnifiedFieldTheory: React.FC = () => {
  const [selectedFormula, setSelectedFormula] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const coreFormulas = [
    {
      id: 1,
      name: "时空同一化方程",
      formula: "\\vec{r}(t)=\\vec{C}t=x\\vec{i}+y\\vec{j}+z\\vec{k}",
      explanation: "描述时空的统一性质，时间与空间的内在联系。",
      derivation: "时间t的定义方程。矢量光速C的模c恒定，但方向可以变化。这是统一场论的基础方程，揭示了时空的本质同一性。",
      category: "基础理论"
    },
    {
      id: 2,
      name: "三维螺旋时空方程",
      formula: "\\vec{r}(t) = r\\cos\\omega t \\cdot \\vec{i} + r\\sin\\omega t \\cdot \\vec{j} + ht \\cdot \\vec{k}",
      explanation: "描述空间以圆柱状螺旋式运动的完整数学表达，包含旋转运动和直线运动的合成。",
      derivation: "将空间的圆柱状螺旋运动分解为旋转分量和直线分量。",
      category: "基础理论"
    },
    {
      id: 3,
      name: "质量定义方程",
      formula: "m = k \\cdot \\frac{dn}{d\\Omega}",
      explanation: "质量m表征空间位移线的密度，其中k是比例常数，dn是穿过立体角dΩ的空间位移线R的条数。",
      derivation: "基于质量是空间运动效应的假设，通过计算单位立体角内空间位移矢量的通量来定义质量。",
      category: "物质定义"
    },
    {
      id: 4,
      name: "引力场定义方程",
      formula: "\\overrightarrow{A}=-Gk\\frac{\\Delta n}{\\Delta s}\\frac{\\overrightarrow{r}}{r}",
      explanation: "引力场A的几何定义，其中G是引力常数，k是比例常数，Δn是空间位移线数量变化。",
      derivation: "通过空间位移线的几何分布来定义引力场，体现了引力的几何本质。",
      category: "场方程"
    },
    {
      id: 5,
      name: "静止动量方程",
      formula: "\\overrightarrow{p}_{0}=m_{0}\\overrightarrow{C}_{0}",
      explanation: "物体静止时周围空间以矢量光速C运动，因而具有静止动量P。",
      derivation: "静止状态下，物体周围空间仍以光速运动，因此具有静止动量。",
      category: "动量理论"
    },
    {
      id: 6,
      name: "运动动量方程",
      formula: "\\overrightarrow{P}=m(\\overrightarrow{C}-\\overrightarrow{V})",
      explanation: "物体以速度V运动时的动量，是静止动量与因物体运动而产生的动量变化的合成。",
      derivation: "运动状态下，物体动量是矢量光速与物体速度差值与质量的乘积。",
      category: "动量理论"
    },
    {
      id: 7,
      name: "宇宙大统一方程",
      formula: "F = \\frac{d\\vec{P}}{dt} = \\vec{C}\\frac{dm}{dt} - \\vec{V}\\frac{dm}{dt} + m\\frac{d\\vec{C}}{dt} - m\\frac{d\\vec{V}}{dt}",
      explanation: "该方程综合了质量变化、速度变化以及矢量光速变化等因素对力的影响，体现了力与动量变化的关系。",
      derivation: "通过对总动量求时间导数，得到统一的力方程，体现了四种基本力的统一性。",
      category: "统一理论"
    },
    {
      id: 8,
      name: "空间波动方程",
      formula: "\\frac{\\partial^2 L}{\\partial x^2} + \\frac{\\partial^2 L}{\\partial y^2} + \\frac{\\partial^2 L}{\\partial z^2} = \\frac{1}{c^2} \\frac{\\partial^2 L}{\\partial t^2}",
      explanation: "描述了空间的波动性质，类似于波动方程，反映了空间中某种物理量的分布随时间和空间的变化规律。",
      derivation: "基于空间运动假设，空间位移满足标准的三维波动方程。",
      category: "波动理论"
    },
    {
      id: 9,
      name: "电荷定义方程",
      formula: "q=k^{\\prime}k\\frac{1}{\\Omega^{2}}\\frac{d\\Omega}{dt}",
      explanation: "电荷表示单位时间里、单位立体角上穿过的空间位移，即质量随时间变化的变化程度。",
      derivation: "电荷是物质粒子周围空间运动状态变化的表现，通过质量变化率来定义。",
      category: "电磁理论"
    },
    {
      id: 10,
      name: "电场定义方程",
      formula: "\\vec{E}=-\\frac{kk^{\\prime}}{4\\pi\\epsilon_0\\Omega^2}\\frac{d\\Omega}{dt}\\frac{\\vec{r}}{r^3}",
      explanation: "电场强度的几何化表达，与立体角Ω的时间变化率相关。",
      derivation: "基于空间几何运动，电场强度与立体角的变化率成正比。",
      category: "电磁理论"
    },
    {
      id: 11,
      name: "磁场定义方程",
      formula: "\\vec{B}=\\frac{\\mu_{0} \\gamma k k^{\\prime}}{4 \\pi \\Omega^{2}} \\frac{d \\Omega}{d t} \\frac{[(x-v t) \\vec{i}+y \\vec{j}+z \\vec{k}]}{\\left[\\gamma^{2}(x-v t)^{2}+y^{2}+z^{2}\\right]^{\\frac{3}{2}}}",
      explanation: "磁场是由运动电场产生的，该方程描述了磁场与电荷运动速度、空间位置等因素的关系。",
      derivation: "运动电荷产生的磁场，考虑相对论效应的修正。",
      category: "电磁理论"
    },
    {
      id: 12,
      name: "变化的引力场产生电磁场",
      formula: "\\frac{\\partial^{2}\\overline{A}}{\\partial t^{2}}=\\frac{\\overline{V}}{f}\\left(\\overline{\\nabla}\\cdot\\overline{E}\\right)-\\frac{C^{2}}{f}\\left(\\overline{\\nabla}\\times\\overline{B}\\right)",
      explanation: "变化的引力场产生电磁场",
      derivation: "变化的引力场产生电磁场",
      category: "统一理论"
    },
    {
      id: 13,
      name: "磁矢势方程",
      formula: "\\vec{\\nabla} \\times \\vec{A} = \\frac{\\vec{B}}{f}",
      explanation: "磁矢势A的旋度与磁场B之间满足的关系，用于描述磁场的性质。",
      derivation: "通过矢量分析，建立磁矢势与磁场的直接联系。",
      category: "电磁理论"
    },
    {
      id: 14,
      name: "变化的引力场产生电场",
      formula: "\\vec{E}=-f\\frac{d\\vec{A}}{dt}",
      explanation: "变化的引力场产生电场",
      derivation: "变化的引力场产生电场",
      category: "波动理论"
    },
    {
      id: 15,
      name: "变化的磁场产生引力场和电场",
      formula: "\\frac{d\\overrightarrow{B}}{dt}=\\frac{-\\overrightarrow{A}\\times\\overrightarrow{E}}{c^2}-\\frac{\\overrightarrow{V}}{c^{2}}\\times\\frac{d\\overrightarrow{E}}{dt}",
      explanation: "描述引力场与电磁场相互转换的动力学方程。",
      derivation: "随时间变化的引力场A产生电场E和磁场B，体现了场的统一性。",
      category: "统一理论"
    },
    {
      id: 16,
      name: "统一场论能量方程",
      formula: "e = m_0 c^2 = mc^2\\sqrt{1 - \\frac{v^2}{c^2}}",
      explanation: "该方程是能量与质量的关系方程，与爱因斯坦的质能方程类似，体现了物体静止能量和运动能量之间的关系。",
      derivation: "基于相对论原理，建立能量、质量和速度之间的关系。",
      category: "能量理论"
    },
    {
      id: 17,
      name: "光速飞行器动力学方程",
      formula: "\\vec{F} = (\\vec{C} - \\vec{V})\\frac{dm}{dt}",
      explanation: "描述了光速飞行器在运动过程中所受的力，与物体的运动速度V、质量变化率dm/dt以及矢量光速C有关。",
      derivation: "通过精确控制物质的质量变化率dm/dt，可以实现接近光速的飞行。这是统一场论最具革命性的预测，为星际旅行提供理论基础。",
      category: "应用技术"
    },
    {
      id: 18,
      name: "空间波动通解",
      formula: "L(r,t) = f(t-r/c) + g(t+r/c)",
      explanation: "空间波动方程的通解，包含向外传播和向内传播的波。",
      derivation: "三维波动方程的标准通解形式。",
      category: "波动理论"
    }
  ];

  const categories = ['全部', '基础理论', '物质定义', '场方程', '动量理论', '统一理论', '波动理论', '电磁理论', '能量理论', '应用技术'];

  const filteredFormulas = selectedCategory === '全部' 
    ? coreFormulas 
    : coreFormulas.filter(formula => formula.category === selectedCategory);

  // 加载 MathJax
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.id = 'MathJax-script';
    script2.async = true;
    script2.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    document.head.appendChild(script2);

    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
      },
      svg: {
        fontCache: 'global'
      }
    };

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
      if (document.head.contains(script2)) document.head.removeChild(script2);
    };
  }, []);

  // 重新渲染数学公式
  useEffect(() => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [selectedCategory, selectedFormula]);

  const [activeTab, setActiveTab] = useState('formulas');

  return (
    <div className="min-h-screen bg-gradient-to-br via-purple-50 to-indigo-100 from-slate-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, currentColor 0%, transparent 70%);
        }
      `}</style>
      <div className="container mx-auto px-6 py-20 max-w-[1800px]">
        
        {/* 标题部分 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mb-24 text-center"
        >
          {/* 三维螺旋时空动画 - 基于 r(t) = r*cos(ωt)i + r*sin(ωt)j + ht*k */}
          <div className="overflow-hidden absolute inset-0 pointer-events-none">
            <div className="relative w-full h-full">
              {/* 多层螺旋轨迹 - 不同半径r */}
              {[...Array(6)].map((_, layerIndex) => {
                const r = 50 + layerIndex * 40; // 半径从50到250
                const h = 2 + layerIndex * 0.5; // 螺距
                const ω = 0.5 + layerIndex * 0.1; // 角速度
                
                return [...Array(20)].map((_, pointIndex) => {
                  const t = pointIndex * 0.5; // 时间参数
                  
                  return (
                    <motion.div
                      key={`spiral-${layerIndex}-${pointIndex}`}
                      className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${layerIndex < 2 ? 'bg-purple-400' : layerIndex < 4 ? 'bg-indigo-400' : 'bg-blue-400'}`}
                      style={{
                        transform: 'translate(-50%, -50%)',
                        opacity: 0.7 - layerIndex * 0.1,
                      }}
                      animate={{
                        x: Array.from({length: 100}, (_, i) => {
                          const time = i * 0.1;
                          return r * Math.cos(ω * time);
                        }),
                        y: Array.from({length: 100}, (_, i) => {
                          const time = i * 0.1;
                          return r * Math.sin(ω * time);
                        }),
                        z: Array.from({length: 100}, (_, i) => {
                          const time = i * 0.1;
                          return h * time;
                        }),
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        delay: layerIndex * 0.5 + pointIndex * 0.1,
                        ease: "linear"
                      }}
                    />
                  );
                });
              })}
              
              {/* 螺旋轨迹线 */}
              {[...Array(4)].map((_, i) => {
                const r = 80 + i * 60;
                const ω = 0.3 + i * 0.1;
                const h = 1.5;
                
                return (
                  <motion.div
                    key={`helix-${i}`}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      width: '2px',
                      height: '2px',
                      background: `linear-gradient(45deg, ${i === 0 ? '#a855f7' : i === 1 ? '#6366f1' : i === 2 ? '#3b82f6' : '#06b6d4'}, transparent)`,
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      x: Array.from({length: 200}, (_, t) => r * Math.cos(ω * t * 0.1)),
                      y: Array.from({length: 200}, (_, t) => r * Math.sin(ω * t * 0.1)),
                      rotateZ: Array.from({length: 200}, (_, t) => h * t * 0.1 * 10), // 模拟z轴运动
                      opacity: [0.8, 0.3, 0.8],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      delay: i * 1,
                      ease: "linear"
                    }}
                  />
                );
              })}
              
              {/* 中心轴线 - 代表k方向 */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-1 bg-gradient-to-t from-purple-500 via-indigo-500 to-blue-500"
                style={{
                  height: '400px',
                  transform: 'translate(-50%, -50%)',
                  transformOrigin: 'center',
                }}
                animate={{
                  scaleY: [0.5, 1.2, 0.5],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* 圆形轨道参考线 */}
              {[...Array(3)].map((_, i) => {
                const radius = 100 + i * 80;
                return (
                  <motion.div
                    key={`orbit-${i}`}
                    className="absolute top-1/2 left-1/2 rounded-full border border-purple-300"
                    style={{
                      width: `${radius * 2}px`,
                      height: `${radius * 2}px`,
                      transform: 'translate(-50%, -50%)',
                      opacity: 0.2,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [0.8, 1.1, 0.8],
                    }}
                    transition={{
                      duration: 8 + i * 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                );
              })}
            </div>
          </div>
          
          {/* 标题内容 */}
          <div className="relative z-10">
            <h1 className="mb-10 text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
              统一场论核心方程
            </h1>
            <p className="mx-auto mb-12 max-w-7xl text-3xl leading-relaxed text-gray-600 dark:text-gray-300">
              探索宇宙的终极奥秘：四种基本力的统一理论，揭示时空、物质与能量的本质联系
            </p>
            <div className="inline-flex items-center px-12 py-6 bg-white rounded-full shadow-2xl dark:bg-gray-800">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                共 {coreFormulas.length} 个核心方程
              </span>
            </div>
          </div>
        </motion.div>

        {/* 主要内容标签页 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap justify-center p-2 bg-white rounded-full shadow-lg dark:bg-gray-800">
              <button
                onClick={() => setActiveTab('formulas')}
                className={`px-6 py-3 text-lg font-medium rounded-full transition-all duration-300 ${
                  activeTab === 'formulas'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700'
                }`}
              >
                📚 核心方程
              </button>
              <button
                onClick={() => setActiveTab('symbols')}
                className={`px-6 py-3 text-lg font-medium rounded-full transition-all duration-300 ${
                  activeTab === 'symbols'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700'
                }`}
              >
                🔢 符号全解
              </button>
              <button
                onClick={() => setActiveTab('animation')}
                className={`px-6 py-3 text-lg font-medium rounded-full transition-all duration-300 ${
                  activeTab === 'animation'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700'
                }`}
              >
                🌌 螺旋时空动画
              </button>
            </div>
          </div>

          {activeTab === 'formulas' && (
            <>
              {/* 分类筛选 */}
              <div className="flex flex-wrap gap-3 justify-center mb-16">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transform scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* 内容区域 */}
        {activeTab === 'formulas' && (
          /* 公式网格 - 合理的卡片布局 */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 gap-10 mb-24 md:grid-cols-2 lg:grid-cols-3"
          >
          {filteredFormulas.map((formula, index) => (
            <motion.div
              key={formula.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                selectedFormula === formula.id ? 'ring-8 ring-purple-500 ring-opacity-30' : ''
              }`}
              onClick={() => setSelectedFormula(selectedFormula === formula.id ? null : formula.id)}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="px-4 py-2 text-base font-bold text-purple-600 bg-purple-100 rounded-full dark:text-purple-400 dark:bg-purple-900">
                    {formula.category}
                  </span>
                  <span className="text-3xl font-bold text-gray-400">
                    #{formula.id}
                  </span>
                </div>
                
                <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                  {formula.name}
                </h3>
                
                <div className="p-6 mb-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl dark:from-gray-700 dark:to-gray-600">
                  <FixedMathFormula 
                    formula={formula.formula}
                    inline={false}
                    className="my-4"
                  />
                </div>
                
                <p className="mb-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  {formula.explanation}
                </p>
                
                <button className="text-base font-semibold text-purple-600 transition-colors dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                  {selectedFormula === formula.id ? '收起详情 ▲' : '查看推导 ▼'}
                </button>
                
                {selectedFormula === formula.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-6 mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-l-4 border-purple-500 dark:from-purple-900/20 dark:to-indigo-900/20"
                  >
                    <h4 className="mb-3 text-lg font-bold text-purple-900 dark:text-purple-100">
                      📚 推导过程：
                    </h4>
                    <p className="text-base leading-relaxed text-purple-800 dark:text-purple-200">
                      {formula.derivation}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          </motion.div>
        )}

        {/* 符号全解标签页内容 */}
        {activeTab === 'symbols' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-24"
          >
            <div className="overflow-hidden bg-white rounded-3xl shadow-2xl dark:bg-gray-800">
              <div className="p-8 text-white bg-gradient-to-r from-purple-500 to-indigo-500">
                <h2 className="mb-4 text-4xl font-bold">🔢 张祥前统一场论核心数学符号全解</h2>
                <p className="text-xl opacity-90">
                  系统性、最详尽的统一场论数学符号梳理与解释
                </p>
              </div>
              <div className="p-8">
                <div className="max-w-none prose dark:prose-invert">
                  {/* 内容简介 */}
                  <div className="mb-12">
                    <h3 className="mb-4 text-2xl font-bold">内容简介</h3>
                    <p className="text-lg leading-relaxed">
                      统一场论构建了一套旨在用"空间几何运动"统一解释所有物理现象的符号体系。该体系从几个核心公设出发，将空间、时间、质量、电荷、场等所有物理量都几何化为空间运动的不同表现形式，试图实现物理学的彻底统一。
                    </p>
                  </div>

                  {/* 目录 */}
                  <div className="p-6 mb-12 bg-gray-50 rounded-2xl dark:bg-gray-700">
                    <h3 className="mb-6 text-2xl font-bold">目录</h3>
                    <ul className="space-y-4 text-lg">
                      <li className="flex gap-3 items-center">
                        <span className="flex justify-center items-center w-8 h-8 font-bold text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-200">1</span>
                        <a href="#basic-framework" className="text-purple-600 dark:text-purple-400 hover:underline">模块一：时空基本框架（理论基石）</a>
                      </li>
                      <li className="flex gap-3 items-center">
                        <span className="flex justify-center items-center w-8 h-8 font-bold text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-200">2</span>
                        <a href="#matter-definition" className="text-purple-600 dark:text-purple-400 hover:underline">模块二：物质与源的几何定义</a>
                      </li>
                      <li className="flex gap-3 items-center">
                        <span className="flex justify-center items-center w-8 h-8 font-bold text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-200">3</span>
                        <a href="#field-description" className="text-purple-600 dark:text-purple-400 hover:underline">模块三：物理场的几何描述</a>
                      </li>
                      <li className="flex gap-3 items-center">
                        <span className="flex justify-center items-center w-8 h-8 font-bold text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-200">4</span>
                        <a href="#dynamics-operators" className="text-purple-600 dark:text-purple-400 hover:underline">模块四：动力学、算符与后期引入的常数</a>
                      </li>
                      <li className="flex gap-3 items-center">
                        <span className="flex justify-center items-center w-8 h-8 font-bold text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-200">5</span>
                        <a href="#summary" className="text-purple-600 dark:text-purple-400 hover:underline">总结：符号体系的特点与目标</a>
                      </li>
                      <li className="flex gap-3 items-center">
                        <span className="flex justify-center items-center w-8 h-8 font-bold text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-200">6</span>
                        <a href="#formula-validation" className="text-purple-600 dark:text-purple-400 hover:underline">公式验证与求导证明</a>
                      </li>
                    </ul>
                  </div>

                  {/* 模块一：时空基本框架 */}
                  <div id="basic-framework" className="mb-16">
                    <h3 className="pb-4 mb-6 text-3xl font-bold border-b-2 border-purple-200 dark:border-purple-800">模块一：时空基本框架（理论基石）</h3>
                    <p className="mb-8 text-lg leading-relaxed">
                      这些符号定义了理论对空间、时间和运动本质的几何化描述，是统一场论的理论基石。
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-900">
                            <th className="px-6 py-4 text-lg font-semibold text-left text-gray-700 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">符号名称</th>
                            <th className="px-6 py-4 text-lg font-semibold text-left text-gray-700 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">属性</th>
                            <th className="px-6 py-4 text-lg font-semibold text-left text-gray-700 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">详细解释与理论内涵</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\vec{R}$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">空间位移矢量（矢量，核心基础量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：理论最基础的几何量，表示空间中的一个“几何点”相对于观察者所在参考位置（通常是一个物体）的位移。<br/>
                              物理内涵：宇宙由“物体”和“空间”构成，空间由无限多“几何点”填充，$\vec{R}$ 描述这些几何点的位置。<br/>
                              核心方程：$\vec{R} = \vec{C} t$（时空同一化方程），将空间位移与时间直接等价，时间被定义为几何点以光速 $\vec{C}$ 走过位移 $\vec{R}$ 所需的度量。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$r$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">空间位移标量（标量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：空间位移矢量 $\vec{R}$ 的模（长度），即 $r = |\vec{R}|$。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\vec{C}$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">矢量光速（矢量，核心假设）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：理论的核心假设量，表示空间本身在真空中运动的速度矢量，其模为常数 $c$，方向可以变化。<br/>
                              物理内涵：物体周围的空间并非静止，而是始终以光速作螺旋运动，这是时间流逝的来源，也是所有物理现象的根源。它是一个具有方向的动态场，不同于作为常数的标量光速 $c$。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$c$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">标量光速（标量，常数）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：矢量光速 $\vec{C}$ 的模，即 $c = |\vec{C}|$，其值为 $299792458\ \text{m/s}$。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$t$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">时间（标量，导出量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：由时空同一化方程 $\vec{R} = \vec{C} t$ 定义，具体为 $t = r / c$。<br/>
                              物理内涵：时间失去了本体论地位，不再是独立的背景流，而是观察者对“空间几何点以光速运动所走过路程”的感知和度量结果。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\vec{V}$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">物体运动速度（矢量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：物体（质点）相对于观察者的普通运动速度矢量，继承自经典物理学。<br/>
                              物理内涵：与代表空间自身运动的 $\vec{C}$ 有本质区别，物体的运动被视作在运动着的“空间背景”上的叠加运动。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$v$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">速度标量（标量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：物体运动速度 $\vec{V}$ 的模，即 $v = |\vec{V}|$。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg">$\omega$</td>
                            <td className="px-6 py-4">角速度（标量/矢量）</td>
                            <td className="px-6 py-4">
                              定义：描述空间几何点（或物体自身）旋转运动的角速度。<br/>
                              物理内涵：用于构建更复杂的空间运动模型——三维螺旋运动，是解释物体自旋、磁场、乃至光子模型的关键参数。<br/>
                              核心方程：三维螺旋时空方程的一部分，例如：$x = h \cos(\omega t), y = h \sin(\omega t), z = c t$。
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 模块二：物质与源的几何定义 */}
                  <div id="matter-definition" className="mb-16">
                    <h3 className="pb-4 mb-6 text-3xl font-bold border-b-2 border-purple-200 dark:border-purple-800">模块二：物质与源的几何定义</h3>
                    <p className="mb-8 text-lg leading-relaxed">
                      这些符号将质量、电荷等物理量重新定义为空间几何运动的度量，实现了物质与空间的统一。
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-900">
                            <th className="px-6 py-4 text-lg font-semibold text-left text-gray-700 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">符号名称</th>
                            <th className="px-6 py-4 text-lg font-semibold text-left text-gray-700 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">属性</th>
                            <th className="px-6 py-4 text-lg font-semibold text-left text-gray-700 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">详细解释与理论内涵</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\Omega$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">立体角（标量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：理论的基本几何量，表示从物体（质点）所在点向周围空间张开的立体角大小。<br/>
                              物理内涵：物体质量几何定义的基石。物体的存在“扭曲”了周围空间，使得空间位移线（$\vec{R}$）的分布不再均匀。$\Omega$ 越小，表示该方向空间扭曲（运动集中度）越剧烈。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$n$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">几何点位移条数（标量，计数）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：为定义“密度”而引入的辅助量，表示穿过一个假想曲面（如高斯面）的“空间位移矢量 $\vec{R}$”的总条数，类比于电场理论中的“电场线条数”。<br/>
                              物理内涵：用于质量定义的更一般（积分）形式，将抽象的空间运动程度进行“量化”计数。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$m$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">质量（标量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：1. 微分形式：$dm = k (dn / d\Omega)$；2. 积分形式：$m = k (n / \Omega)$（常取 $\Omega=4\pi$），其中 $k$ 为比例常数。<br/>
                              物理内涵：质量被几何化，不再是物体内禀的“物质之量”，而是物体对其周围空间光速运动状态扰动程度的度量。单位立体角内穿过的空间位移线条数密度越大，质量越大。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$q$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">电荷（标量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：1. 与立体角变化关联：$q = k' (d\Omega / dt)$；2. 与质量变化关联：$q = -j \Omega^2 (dm/dt)$，其中 $k', j$ 为常数。<br/>
                              物理内涵：电荷被几何化、动态化，是“变化的质量”或“立体角随时间的变化率”。静电荷对应匀速变化的立体角；运动电荷（电流）则产生磁场，试图统一质量与电荷的概念。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$k$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">质量常数（标量，常数）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：将几何量（$n/\Omega$）与物理量（$m$）联系起来的比例常数。<br/>
                              确定方式：通过对比理论导出的引力场几何方程 $\vec{A} = - (G k / \Omega) (\vec{R} / r^3)$ 与牛顿万有引力定律 $F = m \vec{A} = -G m M \vec{R} / r^3$，反推 $k$ 与牛顿常数 $G$ 的关系。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$k'$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">电荷常数（标量，常数）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：将几何量（$d\Omega/dt$）与物理量（$q$）联系起来的比例常数。<br/>
                              确定方式：通过对比理论导出的电场几何方程与库仑定律，反推 $k'$ 与真空介电常数 $\varepsilon_0$ 的关系。与 $k$ 对称，共同描述物质源。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg">$j$</td>
                            <td className="px-6 py-4">质量-电荷关联常数（标量，常数）</td>
                            <td className="px-6 py-4">
                              定义：在统一质量与电荷概念时引入的常数，满足 $q = -j \Omega^2 (dm/dt)$。<br/>
                              物理内涵：直接体现了“电荷是变化的质量”这一核心思想，是连接模块二与模块三的数学纽带。
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 模块三：物理场的几何描述 */}
                  <div id="field-description" className="mb-16">
                    <h3 className="pb-4 mb-6 text-3xl font-bold border-b-2 border-purple-200 dark:border-purple-800">模块三：物理场的几何描述</h3>
                    <p className="mb-8 text-lg leading-relaxed">
                      这些符号描述了各种力场的几何本质，均被视为空间运动（$\vec{R}$ 或 $\vec{C}$）及其导数的不同表现形式。
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-900">
                            <th className="px-6 py-4 text-lg font-semibold text-left text-gray-700 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">符号名称</th>
                            <th className="px-6 py-4 text-lg font-semibold text-left text-gray-700 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">属性</th>
                            <th className="px-6 py-4 text-lg font-semibold text-left text-gray-700 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">详细解释与理论内涵</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\vec{A}$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">引力场强度（矢量，核心场）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：$\vec{A} = - (G m / r^3) \vec{R}$，或几何形式 $\vec{A} = - (G k / \Omega) (\vec{R} / r^3)$。<br/>
                              物理内涵：引力场的几何起源，本质是“单位质量的物体在该点所贡献的空间位移矢量 $\vec{R}$ 的密度”。$\vec{A}$ 的方向指向质量源，表示空间运动向质量源会聚的趋势（表现为吸引），是理论中的母场，其他场由其派生。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$G$ (或 $g$)</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">万有引力常数（标量，常数）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：继承自牛顿力学的万有引力常数。<br/>
                              物理内涵：在引力场定义式中作为比例系数，理论后期试图用更基本的几何常数（如 $\mu_g, \Xi$）来推导 $G$，解释其起源。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\vec{E}$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">电场强度（矢量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：$\vec{E} = f \Omega^2 (d\vec{A}/dt)$，其中 $f$ 为常数；也写作 $\vec{E} = (q / 4\pi\varepsilon_0 r^3) \vec{R}$。<br/>
                              物理内涵：电场是变化的引力场，直接源于“电荷是变化的质量”的定义。静电场对应引力场 $\vec{A}$ 的匀速变化率；变化电场则与磁场耦合，旨在统一引力与电磁作用。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\vec{B}$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">磁感应强度（矢量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：1. 运动电荷产生：$\vec{B} = (\mu_0 / 4\pi) [ \gamma q (\vec{V} \times \vec{R}) / (\gamma^2(x-vt)^2+y^2+z^2)^{3/2} ]$；2. 与电场关系：$\vec{B} = \vec{V} \times \vec{E} / c^2$；3. 与引力场关系：$\nabla \times \vec{A} = - \vec{B} / (f\Omega^2)$。<br/>
                              物理内涵：磁场是引力场的旋度，或运动电场的相对论效应，被解释为空间运动（$\vec{A}$ 场）的涡旋（旋转）分量的体现。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$f$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">电场常数（标量，常数）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：在关系式 $\vec{E} = f \Omega^2 (d\vec{A}/dt)$ 中引入的比例常数。<br/>
                              物理内涵：连接引力场变化率与电场的标度因子，其量纲和数值需要通过与麦克斯韦方程组自洽来确定。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\varepsilon_0$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">真空介电常数（标量，常数）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：继承自标准麦克斯韦电磁学的基本常数。<br/>
                              物理内涵：在库仑定律形式的电场公式中出现，理论试图从几何常数 $k'$、$c$ 等推导出 $\varepsilon_0$，使其不再为基本常数。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg">$\mu_0$</td>
                            <td className="px-6 py-4">真空磁导率（标量，常数）</td>
                            <td className="px-6 py-4">
                              定义：继承自标准麦克斯韦电磁学的基本常数，满足 $c^2 = 1/(\varepsilon_0 \mu_0)$。<br/>
                              物理内涵：在毕奥-萨伐尔定律形式的磁场公式中出现，同样被视为可推导的常数。
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 模块四：动力学、算符与后期引入的常数 */}
                  <div id="dynamics-operators" className="mb-16">
                    <h3 className="pb-4 mb-6 text-3xl font-bold border-b-2 border-purple-200 dark:border-purple-800">模块四：动力学、算符与后期引入的常数</h3>
                    <p className="mb-8 text-lg leading-relaxed">
                      这些符号涉及动力学基本量、数学算符和理论后期引入的核心常数，用于构建统一场论的动力学框架。
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-900">
                            <th className="px-6 py-4 text-lg font-semibold text-left text-gray-700 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">符号名称</th>
                            <th className="px-6 py-4 text-lg font-semibold text-left text-gray-700 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">属性</th>
                            <th className="px-6 py-4 text-lg font-semibold text-left text-gray-700 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">详细解释与理论内涵</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\vec{P}$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">动量（矢量，核心动力学量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：统一场论动量公式：$\vec{P} = m (\vec{C} - \vec{V})$。<br/>
                              物理内涵：动量的全新定义，物体的总动量是其质量 $m$ 乘以“空间本底运动速度 $\vec{C}$”与“物体相对运动速度 $\vec{V}$”之差。当物体静止（$\vec{V}=0$）时，仍有“静止动量” $\vec{P} = m\vec{C}$，认为这是物体蕴含的、由周围空间运动贡献的动量，是理论动力学的基础。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\vec{F}$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">力（矢量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：力的普遍定义仍为动量变化率：$\vec{F} = d\vec{P}/dt$。<br/>
                              物理内涵：将动量定义代入展开，可得到包含电磁力、惯性力、核力项的“统一动力学方程”，实现了各种力的统一描述。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\gamma$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">洛伦兹因子（标量）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：$\gamma = 1 / \sqrt{1 - v^2/c^2}$，继承自狭义相对论。<br/>
                              物理内涵：在运动电荷的电磁场公式、动质量关系中出现，理论试图用自己的时空观（如垂直原理）解释其起源。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\nabla$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">奈布拉算符（算符）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：矢量微分算符，$\nabla = (\partial/\partial x, \partial/\partial y, \partial/\partial z)$。<br/>
                              物理内涵：用于计算场的散度（$\nabla·$）和旋度（$\nabla×$），以推导引力场和电磁场的“高斯定理”、“斯托克斯定理”，并与麦克斯韦方程形式对接。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\partial$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">偏微分符号（算符）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：表示对多个变量函数中的某一个变量求偏导。<br/>
                              物理内涵：广泛用于描述场量随时间、空间的变化，如 $d\vec{A}/dt$， $\partial^2 \vec{R}/\partial t^2$ 等。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\oint, \oiint$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">闭合积分符号（算符）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：表示沿闭合曲线或闭合曲面的积分。<br/>
                              物理内涵：用于质量的定义式 $m = k \oint dn / \oint d\Omega$，以及场论中的高斯定理 $\oiint \vec{A} \cdot d\vec{S} = -4\pi G m$ 等，体现场的全局几何性质。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\Xi$ (Xi)</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">统一起源常数（标量，后期核心常数）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：在后期论文中引入的单一终极常数。<br/>
                              物理内涵：宣称是所有基本物理常数（$G, c, ħ, \varepsilon_0...$）的共同几何起源，通过假设的“螺旋空间膨胀模型”，试图从 $\Xi$ 这一个常数维度完备地推导出整个物理学常数体系，代表理论走向“符号极简主义”的尝试。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$Z$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">引力耦合常数（标量，几何常数）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：$Z = G c / 2$（或类似形式）。<br/>
                              物理内涵：表征引力相互作用的“几何强度”，被解释为“单位四维时空体积内空间位移条数的流量”，是连接牛顿常数 $G$ 与光速 $c$ 的桥梁，旨在揭示 $G$ 的几何起源。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$Z'$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">电磁耦合常数（标量，几何常数）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：$Z' = c^3 \varepsilon_0 / 2$（或类似形式）。<br/>
                              物理内涵：与 $Z$ 对称，表征电磁相互作用的“几何强度”，旨在实现引力与电磁力在几何常数层面的统一表述。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$r_k$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">连接常数（标量，常数）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：在双常数框架中引入，定义为 $r_k = k’ / k$（量纲为 C/s）。<br/>
                              物理内涵：作为桥梁，直接连接质量常数 $k$ 与电荷常数 $k'$，使得电荷与质量的几何定义能够相互转化，是统一引力与电磁作用的关键数学环节。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg border-b border-gray-200 dark:border-gray-700">$\mu_g$</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">空间-质量耦合常数（标量，常数）</td>
                            <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                              定义：量纲为 [kg/m]（质量/长度）。<br/>
                              物理内涵：表示“空间”与“质量”的耦合强度，在后期公式中，用于推导引力常数（$G = 4\pi c^2 / \mu_g$）和普朗克常数（$\hbar = \mu_g c \ell_\Omega^2$），将宏观引力与量子效应联系起来。
                            </td>
                          </tr>
                          <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-mono text-lg">$\ell_\Omega$</td>
                            <td className="px-6 py-4">特征长度（标量，几何尺度）</td>
                            <td className="px-6 py-4">
                              定义：在螺旋空间运动模型中引入的空间螺旋运动的特征尺度。<br/>
                              物理内涵：被认为是空间螺旋结构的固有波长或半径，用于定义质量（$m \propto \mu_g \ell_\Omega$）和电荷（$q \propto 4\pi c \ell_\Omega^2$），是微观几何与宏观物理量之间的关键尺度参数。
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 总结：符号体系的特点与目标 */}
                  <div id="summary" className="mb-16">
                    <h3 className="pb-4 mb-6 text-3xl font-bold border-b-2 border-purple-200 dark:border-purple-800">总结：符号体系的特点与目标</h3>
                    <p className="mb-8 text-lg leading-relaxed">
                      统一场论的符号体系是一套旨在用“空间几何运动”统一解释所有物理现象的完整体系，具有以下核心特点：
                    </p>
                    
                    <div className="space-y-8">
                      <div className="p-6 bg-purple-50 rounded-2xl dark:bg-purple-900/30">
                        <h4 className="mb-4 text-2xl font-bold text-purple-800 dark:text-purple-300">1. 几何化的本质</h4>
                        <p className="text-lg leading-relaxed">
                          所有物理量都被几何化为空间运动的不同表现形式，实现了物质、能量、场的统一几何描述：
                        </p>
                        <ul className="mt-4 space-y-2 list-disc list-inside">
                          <li>空间位移 $\vec{R}$ 是最基础的几何量</li>
                          <li>时间 $t$ 被定义为空间运动的度量：$t = r/c$</li>
                          <li>质量 $m$ 是空间运动的密度：$m = k(n/Ω)$</li>
                          <li>电荷 $q$ 是变化的质量：$q = k'(dΩ/dt)$</li>
                          <li>场 $\vec{A}, \vec{E}, \vec{B}$ 是空间运动的不同形式</li>
                        </ul>
                      </div>

                      <div className="p-6 bg-indigo-50 rounded-2xl dark:bg-indigo-900/30">
                        <h4 className="mb-4 text-2xl font-bold text-indigo-800 dark:text-indigo-300">2. 统一的动力学框架</h4>
                        <p className="text-lg leading-relaxed">
                          通过几何化的动量定义 $\vec{P} = m(\vec{C} - \vec{V})$，实现了各种力的统一描述：
                        </p>
                        <ul className="mt-4 space-y-2 list-disc list-inside">
                          <li>引力：空间运动的会聚趋势</li>
                          <li>电磁力：空间运动的涡旋分量</li>
                          <li>核力：空间运动的量子化效应</li>
                          <li>惯性力：空间运动的相对性</li>
                        </ul>
                      </div>

                      <div className="p-6 bg-blue-50 rounded-2xl dark:bg-blue-900/30">
                        <h4 className="mb-4 text-2xl font-bold text-blue-800 dark:text-blue-300">3. 常数的几何起源</h4>
                        <p className="text-lg leading-relaxed">
                          理论试图将所有基本物理常数（$G, c, ħ, ε_0, μ_0$）统一为空间几何运动的导出量，从单一的统一起源常数 $\Xi$ 或双常数（$k, k'$）推导出来，实现了常数体系的简化和统一。
                        </p>
                      </div>

                      <div className="p-6 bg-green-50 rounded-2xl dark:bg-green-900/30">
                        <h4 className="mb-4 text-2xl font-bold text-green-800 dark:text-green-300">4. 广泛的兼容性</h4>
                        <p className="text-lg leading-relaxed">
                          该体系与现有物理理论具有良好的兼容性：
                        </p>
                        <ul className="mt-4 space-y-2 list-disc list-inside">
                          <li>低速极限下退化为牛顿力学</li>
                          <li>弱场极限下与广义相对论一致</li>
                          <li>量子尺度下为量子力学提供了几何解释</li>
                          <li>与麦克斯韦方程组形式上兼容</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 公式验证与求导证明 */}
                  <div id="formula-validation" className="mb-16">
                    <h3 className="pb-4 mb-6 text-3xl font-bold border-b-2 border-purple-200 dark:border-purple-800">公式验证与求导证明</h3>
                    
                    <div className="space-y-12">
                      <div className="p-6 bg-gray-50 rounded-2xl dark:bg-gray-800">
                        <h4 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">1. 万有引力常数的量子几何表达式验证</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-white rounded-xl dark:bg-gray-700">
                            <strong className="text-lg">公式</strong>：$G = 16π²ħc/k²$</div>
                          <div>
                            <strong className="text-lg">验证过程</strong>：
                            <ol className="mt-2 space-y-2 list-decimal list-inside">
                              <li><strong>量子几何常数定义</strong>：$k = 4πm_p$，其中 $m_p$ 为普朗克质量</li>
                              <li><strong>普朗克质量标准定义</strong>：$m_p = \sqrt{(ħc)/G}$</li>
                              <li><strong>代入验证</strong>：
                                <div className="p-4 mt-2 font-mono bg-gray-100 rounded-lg dark:bg-gray-900">
                                  $G = 16π²ħc/(4πm_p)² = 16π²ħc/(16π²m_p²) = ħc/m_p²$
                                </div>
                              </li>
                              <li><strong>将普朗克质量定义代入</strong>：
                                <div className="p-4 mt-2 font-mono bg-gray-100 rounded-lg dark:bg-gray-900">
                                  $G = ħc/(√(ħc/G))² = ħc/(ħc/G) = G$
                                </div>
                              </li>
                              <li><strong>量纲一致性</strong>：
                                <ul className="mt-2 space-y-1 list-disc list-inside">
                                  <li>$G$ 的量纲：$m³kg⁻¹s⁻²$</li>
                                  <li>$16π²ħc/k²$ 的量纲：$(kgm²s⁻¹)(ms⁻¹)/kg² = m³kg⁻¹s⁻²$</li>
                                  <li>量纲完全一致</li>
                                </ul>
                              </li>
                            </ol>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-2xl dark:bg-gray-800">
                        <h4 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">2. 引力场与电场的统一关系验证</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-white rounded-xl dark:bg-gray-700">
                            <strong className="text-lg">公式</strong>：$\vec{E} = fΩ²(d\vec{A}/dt)$</div>
                          <div>
                            <strong className="text-lg">验证过程</strong>：
                            <ol className="mt-2 space-y-2 list-decimal list-inside">
                              <li><strong>引力场定义</strong>：$\vec{A} = -Gm\vec{R}/r³$</li>
                              <li><strong>质量变化与电荷关系</strong>：$q = -jΩ²(dm/dt)$</li>
                              <li><strong>电场定义</strong>：$\vec{E} = q\vec{R}/(4πε_0r³)$</li>
                              <li><strong>代入推导</strong>：
                                <div className="p-4 mt-2 font-mono bg-gray-100 rounded-lg dark:bg-gray-900">
                                  $d\vec{A}/dt = -G(dm/dt)\vec{R}/r³ = G(q/(jΩ²))\vec{R}/r³$<br/>
                                  $fΩ²(d\vec{A}/dt) = fΩ²G(q/(jΩ²))\vec{R}/r³ = (fG/j)q\vec{R}/r³$</div>
                              </li>
                              <li><strong>系数匹配</strong>：通过调整常数 $f, j$，使 $(fG/j) = 1/(4πε_0)$，即可得到电场的正确形式</li>
                            </ol>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-2xl dark:bg-gray-800">
                        <h4 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">3. 动量定义的相对论兼容验证</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-white rounded-xl dark:bg-gray-700">
                            <strong className="text-lg">公式</strong>：$\vec{P} = m(\vec{C} - \vec{V})$</div>
                          <div>
                            <strong className="text-lg">验证过程</strong>：
                            <ol className="mt-2 space-y-2 list-decimal list-inside">
                              <li><strong>静止动量</strong>：当 $\vec{V}=0$ 时，$\vec{P} = m\vec{C}$，符合相对论的能量动量关系 $E = mc²$（乘以光速 $c$ 后）</li>
                              <li><strong>低速近似</strong>：当 $v \ll c$ 时，$\vec{C}$ 的大小为 $c$，方向与 $\vec{V}$ 垂直分量可忽略，$\vec{P} ≈ mc\vec{C}_0 - m\vec{V}$，其中 $\vec{C}_0$ 为 $\vec{C}$ 的单位矢量，前项为常数，可视为相对论质量修正的来源</li>
                              <li><strong>洛伦兹变换兼容性</strong>：通过引入洛伦兹因子 $\gamma$，可将动量定义与相对论动量公式 $\vec{P} = γmv$ 对应起来</li>
                            </ol>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-2xl dark:bg-gray-800">
                        <h4 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">4. 时空同一化方程的导数验证</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-white rounded-xl dark:bg-gray-700">
                            <strong className="text-lg">公式</strong>：$\vec{R} = \vec{C}t$（时空同一化方程）</div>
                          <div>
                            <strong className="text-lg">验证过程</strong>：
                            <ol className="mt-2 space-y-2 list-decimal list-inside">
                              <li><strong>速度定义</strong>：对时间求导得 $\vec{V} = d\vec{R}/dt = \vec{C}$，表明空间本身以光速运动</li>
                              <li><strong>加速度定义</strong>：二阶导数 $d²\vec{R}/dt² = 0$，空间的匀速运动是其固有属性</li>
                              <li><strong>相对论效应</strong>：通过引入空间螺旋运动 $\vec{R}(t) = h\cos(ωt)\vec{i} + h\sin(ωt)\vec{j} + ct\vec{k}$，可解释相对论的钟慢效应和尺缩效应</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 结语 */}
                  <div className="p-8 mt-20 text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl">
                    <h3 className="mb-6 text-3xl font-bold">结语</h3>
                    <p className="text-xl leading-relaxed">
                      统一场论的符号体系代表了一种将物理学几何化的大胆尝试，通过将所有物理现象统一为空间的几何运动，为物理学的大统一提供了新的思路和框架。虽然该理论在实验验证、数学严密性等方面仍面临挑战，但它的几何化思想和统一视角为理解宇宙的本质提供了全新的视角。
                    </p>
                    <p className="mt-4 text-xl leading-relaxed">
                      该符号体系的严密性、与现有物理体系的兼容性以及其预言的可验证性，是评估该理论科学价值的关键。随着进一步的理论发展和实验验证，这一几何化的统一场论有望为物理学的未来发展开辟新的道路。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 螺旋时空动画标签页内容 */}
        {activeTab === 'animation' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-24"
          >
            <div className="overflow-hidden bg-white rounded-3xl shadow-2xl dark:bg-gray-800">
              <div className="p-8 text-white bg-gradient-to-r from-purple-500 to-indigo-500">
                <h2 className="mb-4 text-4xl font-bold">🌌 圆柱状螺旋时空动画</h2>
                <p className="text-xl opacity-90">
                  基于时空同一化方程和三维螺旋时空方程的实时可视化
                </p>
                <div className="grid grid-cols-1 gap-4 mt-6 text-sm md:grid-cols-2">
                  <div className="p-3 rounded-lg bg-white/20">
                    <strong>时空同一化方程:</strong><br/>
                    ds² = c²dt² - dx² - dy² - dz²
                  </div>
                  <div className="p-3 rounded-lg bg-white/20">
                    <strong>三维螺旋时空方程:</strong><br/>
                    r(t) = R·cos(ωt + φ)î + R·sin(ωt + φ)ĵ + h·t·k̂
                  </div>
                </div>
              </div>
              <div className="h-[800px]">
                <Enhanced3DSpiralAnimation />
              </div>
            </div>
          </motion.div>
        )}

        {/* 理论意义展示 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="p-16 text-white bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-3xl shadow-2xl"
        >
          <h2 className="mb-16 text-6xl font-bold text-center">统一场论的革命性意义</h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-8 text-8xl">🌌</div>
              <h3 className="mb-6 text-3xl font-bold">时空统一</h3>
              <p className="text-xl leading-relaxed opacity-90">揭示时间与空间的本质同一性，重新定义宇宙的基本结构</p>
            </div>
            <div className="text-center">
              <div className="mb-8 text-8xl">⚡</div>
              <h3 className="mb-6 text-3xl font-bold">四力统一</h3>
              <p className="text-xl leading-relaxed opacity-90">统一引力、电磁力、强核力、弱核力为一个基本相互作用</p>
            </div>
            <div className="text-center">
              <div className="mb-8 text-8xl">🚀</div>
              <h3 className="mb-6 text-3xl font-bold">光速飞行</h3>
              <p className="text-xl leading-relaxed opacity-90">为星际旅行提供理论基础，开启人类宇宙探索新纪元</p>
            </div>
            <div className="text-center">
              <div className="mb-8 text-8xl">🔬</div>
              <h3 className="mb-6 text-3xl font-bold">物质本质</h3>
              <p className="text-xl leading-relaxed opacity-90">重新定义质量、能量和电荷，揭示物质的几何本质</p>
            </div>
          </div>
        </motion.div>

        {/* 理论特色 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="p-16 mt-24 bg-white rounded-3xl shadow-2xl dark:bg-gray-800"
        >
          <h2 className="mb-16 text-5xl font-bold text-center text-gray-900 dark:text-white">
            🌟 理论特色与优势
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex justify-center items-center mx-auto mb-8 w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                <i className="text-4xl text-white fas fa-atom"></i>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">统一性</h3>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                用一个基本假设统一描述四种基本相互作用力
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center mx-auto mb-8 w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                <i className="text-4xl text-white fas fa-cube"></i>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">几何化</h3>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                将所有物理现象归结为空间几何运动
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center mx-auto mb-8 w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <i className="text-4xl text-white fas fa-rocket"></i>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">预测性</h3>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                预测光速飞行器等革命性技术的可能性
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center mx-auto mb-8 w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                <i className="text-4xl text-white fas fa-lightbulb"></i>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">创新性</h3>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                挑战传统物理学框架，提出全新理论体系
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnifiedFieldTheory;