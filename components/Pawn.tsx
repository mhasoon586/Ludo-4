@@ .. @@
 const Pawn: React.FC<PawnProps> = ({ color, isMovable, onClick }) => {
   const colorScheme = PLAYER_COLORS_HEX[color];
-  const pulseClass = isMovable ? 'animate-pulse cursor-pointer ring-4 ring-white ring-opacity-75' : '';
+  const pulseClass = isMovable ? 'animate-pulse cursor-pointer ring-2 ring-white ring-opacity-90 shadow-lg shadow-white/50' : '';
   const interactiveClass = isMovable ? 'cursor-pointer' : 'cursor-default';

   return (
     <div
       onClick={isMovable ? onClick : undefined}
-      className={`w-full h-full rounded-full ${colorScheme.dark} ${colorScheme.border} border-2 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 ${pulseClass} ${interactiveClass}`}
+      className={`w-full h-full rounded-full ${colorScheme.dark} ${colorScheme.border} border-2 flex items-center justify-center shadow-lg transition-all duration-300 transform ${isMovable ? 'hover:scale-125' : 'hover:scale-105'} ${pulseClass} ${interactiveClass}`}
     >
-      <div className={`w-3/5 h-3/5 rounded-full ${colorScheme.light}`}></div>
+      <div className={`w-3/5 h-3/5 rounded-full ${colorScheme.light} shadow-inner`}></div>
     </div>
   );
 };

export default Pawn