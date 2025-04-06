import { NextResponse } from 'next/server'

export async function GET(request) {
  // Log request metadata
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`)
  
  // Return welcome message
  return NextResponse.json({
    message: 'Welcome to the Budge-M API Service!',
    timestamp: new Date().toISOString()
  })
}
