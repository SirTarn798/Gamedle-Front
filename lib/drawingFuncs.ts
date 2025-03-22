function getLevelColor(level : number) {
    switch(level) {
      case 1:
        return { text: "#4ADE80", bg: "#064E3B", border: "#059669" }; // Green/Teal - Easy
      case 2:
        return { text: "#60A5FA", bg: "#1E3A8A", border: "#3B82F6" }; // Blue - Moderate
      case 3:
        return { text: "#FBBF24", bg: "#92400E", border: "#F59E0B" }; // Amber - Challenging
      case 4:
        return { text: "#FB923C", bg: "#7C2D12", border: "#F97316" }; // Orange - Hard
      case 5:
        return { text: "#EF4444", bg: "#7F1D1D", border: "#DC2626" }; // Red - Terrifying
      default:
        return { text: "#FFFFFF", bg: "#000000", border: "#6B7280" }; // White on black - Unknown
    }
  }
  
  // Draw level indicator with custom styling
  export function drawLevelIndicator(ctx : CanvasRenderingContext2D, level : number, x : number, y : number) {
    const colors = getLevelColor(level);
    const text = `LEVEL ${level}`;
    
    ctx.save();
    
    // Set text properties
    ctx.font = "bold 36px Poppins";
    
    // Calculate text width for the background
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const padding = 16;
    const borderWidth = 3;
    
    // Draw background with border
    ctx.fillStyle = colors.bg;
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = borderWidth;
    
    // Draw rounded rectangle for background
    const rectX = x - padding;
    const rectY = y - 30;
    const rectWidth = textWidth + (padding * 2);
    const rectHeight = 44;
    const cornerRadius = 10;
    
    ctx.beginPath();
    ctx.moveTo(rectX + cornerRadius, rectY);
    ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
    ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius);
    ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
    ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight);
    ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
    ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius);
    ctx.lineTo(rectX, rectY + cornerRadius);
    ctx.quadraticCurveTo(rectX, rectY, rectX + cornerRadius, rectY);
    ctx.closePath();
    
    ctx.fill();
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = colors.text;
    ctx.fillText(text, x, y);
    
    ctx.restore();
  }