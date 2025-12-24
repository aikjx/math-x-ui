import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { learningPaths } from '@/lib/data';
import TimeSpaceVisualization from '@/components/TimeSpaceVisualization';

// 防抖Hook
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// 骨架屏组件
const SkeletonCard = () => (
  <div className="p-6 bg-white shadow-lg rounded-xl animate-pulse dark:bg-gray-800">
    <div className="w-12 h-12 mb-4 bg-gray-300 rounded-lg dark:bg-gray-700"></div>
    <div className="h-4 mb-2 bg-gray-300 rounded dark:bg-gray-700"></div>
    <div className="h-3 mb-4 bg-gray-300 rounded dark:bg-gray-700"></div>
    <div className="h-8 bg-gray-300 rounded dark:bg-gray-700"></div>
  </div>
);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const navigate = useNavigate();
  
  // 防抖搜索查询
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // 使用React提供的方式检测客户端环境
  const isClient = typeof window !== 'undefined';
  
  // 处理搜索
  const handleSearch = useCallback((e?: Event) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      if (searchQuery.toLowerCase().includes('symbol') || searchQuery.toLowerCase().includes('符号')) {
        navigate(`/math-symbols?search=${encodeURIComponent(searchQuery)}`);
      } else if (searchQuery.toLowerCase().includes('tool') || searchQuery.toLowerCase().includes('工具')) {
        navigate(`/math-tools?search=${encodeURIComponent(searchQuery)}`);
      } else if (searchQuery.toLowerCase().includes('resource') || searchQuery.toLowerCase().includes('资源')) {
        navigate(`/mathematics-resources?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/learning-path?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  }, [searchQuery, navigate]);
  
  // 优化搜索过滤逻辑
  const useOptimizedSearch = (query: string, items: typeof learningPaths) => {
    return useMemo(() => {
      if (!query.trim()) return items;
      const lowerQuery = query.toLowerCase();
      return items.filter(path =>
        path.title.toLowerCase().includes(lowerQuery) ||
        path.description.toLowerCase().includes(lowerQuery)
      );
    }, [query, items]);
  };

  // 模拟加载完成
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 模拟进度数据
  useEffect(() => {
    if (isClient) {
      const savedProgress = localStorage.getItem('learningProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        // 初始化一些示例进度
        const initialProgress = {
          'basic-algebra': 75,
          'calculus': 45,
          'geometry': 60,
          'statistics': 30
        };
        setProgress(initialProgress);
        localStorage.setItem('learningProgress', JSON.stringify(initialProgress));
      }
    }
  }, [isClient]);

  const filteredPaths = useOptimizedSearch(debouncedSearchQuery, learningPaths);

  // 开始学习按钮点击处理
  const handleStartLearning = useCallback((pathId: string) => {
    navigate(`/learning-path/${pathId}`);
  }, [navigate]);

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
      {/* 轮播公告 */}
      {showAnnouncement && (
        <div className="sticky top-0 z-50 w-full bg-white shadow-md dark:bg-gray-800">
          <div className="container px-4 py-2 mx-auto">
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-800 dark:text-gray-200">📣 欢迎使用数学学习平台！所有功能完全免费。</div>
              <button 
                onClick={() => setShowAnnouncement(false)}
                className="p-1 ml-2 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mx-auto max-w-7xl">
        {/* 英雄区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative mb-20 overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 transform hover:scale-[1.01] transition-transform duration-500"
        >
          {/* 动态装饰元素 */}
          <motion.div
            className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl"
            animate={{ 
              x: [0, 30, 0], 
              y: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl"
            animate={{ 
              x: [0, -40, 0], 
              y: [0, 40, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          />
          
          <div className="container px-6 py-24 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl tracking-tight">
                <span className="block mb-2">探索数学的</span>
                <span className="relative inline-block">
                  <span className="relative z-10">奇妙世界</span>
                  <motion.span 
                    className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 opacity-60 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="max-w-3xl mx-auto mb-10 text-xl text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              从基础到高级，从理论到应用，一站式掌握数学知识，开启你的数学探索之旅
            </motion.p>
            
            {/* 搜索栏 */}
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索数学符号、工具、资源或学习路径..."
                  className="w-full px-5 py-4 pl-12 text-lg bg-white/90 border-2 border-transparent rounded-full focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-transparent dark:bg-gray-800/90 dark:text-white"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 top-2 px-6 py-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  搜索
                </motion.button>
                <span className="absolute left-4 top-3.5 text-gray-500">
                  <i className="fa-solid fa-search text-xl"></i>
                </span>
              </form>
            </motion.div>
          </div>
        </motion.div>
        
        {/* 特色功能 */}
        <motion.div 
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="px-3 py-1 text-xs font-semibold text-indigo-600 uppercase rounded-full bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400">
            核心功能
          </span>
          <h2 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
            探索我们的数学工具集
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600 dark:text-gray-300">
            从基础到高级，满足你的各种数学学习需求
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "🔢", title: "数学符号大全", description: "查找并复制500+常用数学符号，了解它们的含义、用法和LaTeX代码。", path: "/math-symbols", color: "from-purple-500 to-pink-500", delay: 0 },
            { icon: "🛠️", title: "数学工具集", description: "使用50+数学计算器、转换器和求解器，轻松解决复杂计算问题。", path: "/math-tools", color: "from-orange-500 to-red-500", delay: 0.1 },
            { icon: "📊", title: "实用数学应用", description: "探索数学在日常生活、金融、科学和工程领域的实际应用案例。", path: "/practical-mathematics", color: "from-teal-500 to-cyan-500", delay: 0.2 },
            { icon: "🤖", title: "AI数学助手", description: "利用人工智能解答数学问题，提供步骤详解和个性化学习建议。", path: "/ai-math", color: "from-indigo-500 to-purple-500", delay: 0.3 },
            { icon: "📚", title: "数学资源库", description: "访问100+精选数学教程、视频和文献，覆盖从基础到高级的各个领域。", path: "/mathematics-resources", color: "from-green-500 to-emerald-500", delay: 0.4 },
            { icon: "🎓", title: "个性化学习路径", description: "按照20+科学设计的学习路径循序渐进，高效掌握数学知识体系。", path: "/learning-path", color: "from-yellow-500 to-orange-500", delay: 0.5 }
          ].map((feature, index) => (
            <motion.div
              key={feature.path}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
              whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 dark:bg-gray-800"
            >
              <div className={`p-8 bg-gradient-to-br ${feature.color}`}>
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="mt-2 text-2xl font-bold text-white">{feature.title}</h3>
              </div>
              <div className="p-6">
                <p className="mb-4 text-gray-600 dark:text-gray-300">{feature.description}</p>
                <motion.Link
                  to={feature.path}
                  className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  立即体验 <i className="ml-2 fa-solid fa-arrow-right"></i>
                </motion.Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* 学习路径 */}
        <motion.div 
          className="mt-32 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-10 text-center">
            <span className="px-3 py-1 text-xs font-semibold text-indigo-600 uppercase rounded-full bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400">
              学习路径
            </span>
            <h2 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
              循序渐进的学习计划
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600 dark:text-gray-300">
              精心设计的学习路径，帮助你系统掌握数学知识
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // 骨架屏加载状态
              Array(3).fill(0).map((_, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <SkeletonCard />
                </motion.div>
              ))
            ) : (
              // 实际学习路径卡片
              filteredPaths.slice(0, 3).map((path) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-90"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                      <h3 className="text-2xl font-bold text-white">{path.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${path.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : path.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                          {path.difficulty === 'beginner' ? '初级' : path.difficulty === 'intermediate' ? '中级' : '高级'}
                        </span>
                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                          <i className="fa-solid fa-clock mr-1"></i> {path.duration}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        <i className="fa-solid fa-book mr-1"></i> {path.lessons} 课时
                      </span>
                    </div>
                    
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                      {path.description}
                    </p>
                    
                    {/* 进度条 */}
                    {progress[path.id.toString()] && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">学习进度</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress[path.id.toString()]}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                          <motion.div
                            className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress[path.id.toString()]}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={() => handleStartLearning(path.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                      >
                        {progress[path.id.toString()] && progress[path.id.toString()] > 0 ? '继续学习' : '开始学习'}
                      </motion.button>
                      <Link to={`/learning-path/${path.id}`} className="p-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          {!loading && filteredPaths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mt-10"
            >
              <motion.Link
                to="/learning-path"
                className="inline-flex items-center px-8 py-3 text-lg font-medium text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                查看全部学习路径 <i className="ml-2 fa-solid fa-arrow-right"></i>
              </motion.Link>
            </motion.div>
          )}
        </motion.div>
        
        {/* 平台数据统计 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="py-16 mb-10 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900"
        >
          <div className="container px-6 mx-auto">
            <div className="mb-12 text-center">
              <span className="px-3 py-1 text-xs font-semibold text-indigo-600 uppercase rounded-full bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400">
                平台概况
              </span>
              <h2 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
                我们的数学资源
              </h2>
              <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600 dark:text-gray-300">
                所有功能和资源完全免费开放使用，助你轻松学习数学
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { icon: '🔤', count: '500+', label: '数学符号', color: 'blue', delay: 0 },
                { icon: '🛠️', count: '50+', label: '学习工具', color: 'green', delay: 0.1 },
                { icon: '📚', count: '100+', label: '学习资源', color: 'purple', delay: 0.2 },
                { icon: '🗺️', count: '20+', label: '学习路径', color: 'red', delay: 0.3 }
              ].map((stat, index) => {
                const colorMap = {
                  blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
                  green: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
                  purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
                  red: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                };
                
                return (
                  <motion.div
                    key={stat.icon}
                    className="p-6 text-center bg-white rounded-2xl shadow-lg dark:bg-gray-800 transition-all duration-300 hover:shadow-xl transform"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: stat.delay }}
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 text-3xl ${colorMap[stat.color] || colorMap.blue} rounded-full`}>
                      {stat.icon}
                    </div>
                    <motion.div 
                      className="text-4xl font-bold text-gray-900 dark:text-white"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: stat.delay + 0.2, duration: 0.5 }}
                    >
                      {stat.count}
                    </motion.div>
                    <div className="mt-2 text-lg text-gray-600 dark:text-gray-300">{stat.label}</div>
                    <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                      ✓ 免费使用
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}