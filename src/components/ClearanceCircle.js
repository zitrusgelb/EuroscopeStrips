import React, { useRef, useEffect } from 'react'

export default function ClearanceCircle() {
    const canvasRef = useRef(null)
  
    const drawCenter = ctx => {
      ctx.fillStyle = '#151515'
      ctx.beginPath()
      ctx.arc(300, 300, 300, 0 * Math.PI, 2 * Math.PI)
      ctx.fill()
    }

    const drawFirst = ctx => {
      ctx.strokeStyle = '#f00'
      ctx.lineWidth = 100;
      ctx.beginPath()
      ctx.arc(300, 300, 200, 0 * Math.PI, 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.arc(300, 300, 200, 0.12 * Math.PI, 2 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.arc(300, 300, 200, 2 * 0.12 * Math.PI, 3 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.strokeStyle = '#ff0'
      ctx.beginPath()
      ctx.arc(300, 300, 200, 3 * 0.12 * Math.PI, 5.5 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.strokeStyle = '#f00'
      ctx.beginPath()
      ctx.arc(300, 300, 200, 5.5 * 0.12 * Math.PI, 6.2 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.arc(300, 300, 200, 6.2 * 0.12 * Math.PI, 7 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.arc(300, 300, 200, 7 * 0.12 * Math.PI, 8.3 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.arc(300, 300, 200, 8.3 * 0.12 * Math.PI, 9 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.arc(300, 300, 200, 9 * 0.12 * Math.PI, 10 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.arc(300, 300, 200, 10 * 0.12 * Math.PI, 11 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.strokeStyle = '#ff0'
      ctx.beginPath()
      ctx.arc(300, 300, 200, 11 * 0.12 * Math.PI, 12.5 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.strokeStyle = '#f0f'
      ctx.beginPath()
      ctx.arc(300, 300, 200, 12.5 * 0.12 * Math.PI, 14 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()
      ctx.strokeText("PH", 320, 130)

      ctx.strokeStyle = '#f00'

      ctx.beginPath()
      ctx.arc(300, 300, 200, 14 * 0.12 * Math.PI, 15 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.arc(300, 300, 200, 15 * 0.12 * Math.PI, 16 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.arc(300, 300, 200, 16 * 0.12 * Math.PI, 16.67 * 0.12 * Math.PI)
      ctx.stroke()
      ctx.closePath()
    }

    
    
    useEffect(() => {
      
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      //Our draw come here
      //drawFirst(context)
      drawCenter(context)
    }, [drawCenter, drawFirst])
    
    return <canvas ref={canvasRef} height="600px" width="600px" />
}