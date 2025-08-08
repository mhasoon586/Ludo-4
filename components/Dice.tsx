@@ .. @@
 const Dice: React.FC<DiceProps> = ({ value, isRolling, onRoll, canRoll }) => {
   const dotPatterns: { [key: number]: React.ReactNode[] } = {
     1: [<Dot key="1" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />],
     2: [<Dot key="1" position="top-1/4 left-1/4" />, <Dot key="2" position="bottom-1/4 right-1/4" />],
     3: [<Dot key="1" position="top-1/4 left-1/4" />, <Dot key="2" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />, <Dot key="3" position="bottom-1/4 right-1/4" />],
     4: [<Dot key="1" position="top-1/4 left-1/4" />, <Dot key="2" position="top-1/4 right-1/4" />, <Dot key="3" position="bottom-1/4 left-1/4" />, <Dot key="4" position="bottom-1/4 right-1/4" />],
     5: [<Dot key="1" position="top-1/4 left-1/4" />, <Dot key="2" position="top-1/4 right-1/4" />, <Dot key="3" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />, <Dot key="4" position="bottom-1/4 left-1/4" />, <Dot key="5" position="bottom-1/4 right-1/4" />],
     6: [<Dot key="1" position="top-1/4 left-1/4" />, <Dot key="2" position="top-1/4 right-1/4" />, <Dot key="3" position="top-1/2 left-1/4 -translate-y-1/2" />, <Dot key="4" position="top-1/2 right-1/4 -translate-y-1/2" />, <Dot key="5" position="bottom-1/4 left-1/4" />, <Dot key="6" position="bottom-1/4 right-1/4" />],
   };

   return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
+    <div className="flex flex-col items-center space-y-6 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
+      <h3 className="text-lg font-semibold text-gray-200">Roll the Dice</h3>
       <div
-        className={`relative w-20 h-20 md:w-28 md:h-28 bg-white rounded-2xl shadow-lg border-2 border-gray-300 flex items-center justify-center transition-transform duration-500 ${isRolling ? 'animate-spin' : ''}`}
+        className={`relative w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-2xl border-2 border-gray-300 flex items-center justify-center transition-all duration-500 ${isRolling ? 'animate-spin scale-110' : 'hover:scale-105'}`}
       >
         {dotPatterns[value]}
       </div>
       <button
         onClick={onRoll}
         disabled={!canRoll || isRolling}
-        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
+        className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
       >
-        {isRolling ? 'Rolling...' : 'Roll Dice'}
+        {isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
       </button>
     </div>
   );
 };

export default Dice;