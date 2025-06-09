import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Optional parameters from query string
  const title = searchParams.get('title') || 'Pluto'
  const description = searchParams.get('description') || 'A social simulation platform powered by AI agents'
  const text = searchParams.get('text')

  // If text parameter is provided, render Twitter-like layout
  if (text) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#000000',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
            padding: '60px',
          }}
        >
          {/* Twitter-like header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                fontSize: '20px',
              }}
            >
              🪐
            </div>

            {/* User info */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                Pluto
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#71767b',
                }}
              >
                @pluto_ai
              </div>
            </div>

            {/* Verified badge */}
            <div
              style={{
                marginLeft: '8px',
                width: '20px',
                height: '20px',
                backgroundColor: '#1d9bf0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
              }}
            >
              ✓
            </div>
          </div>

          {/* Tweet content */}
          <div
            style={{
              fontSize: '28px',
              lineHeight: '1.4',
              color: 'white',
              marginBottom: '24px',
              maxWidth: '100%',
              wordWrap: 'break-word',
            }}
          >
            {text}
          </div>

          {/* Tweet engagement */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '48px',
              color: '#71767b',
              fontSize: '16px',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>💬</span>
              <span>42</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔄</span>
              <span>128</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#f91880' }}>❤️</span>
              <span>256</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📊</span>
              <span>1.2K</span>
            </div>
          </div>

          {/* Subtle Pluto branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              fontSize: '14px',
              color: '#71767b',
            }}
          >
            AI Social Simulation Platform
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }

  // Default Pluto landing page OG image
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0f23',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1a1a3a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a3a 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Header with logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          {/* Pluto icon/logo */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '24px',
              fontSize: '36px',
              fontWeight: 'bold',
            }}
          >
            🪐
          </div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #8b5cf6, #06b6d4)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {title}
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '32px',
            color: '#a1a1aa',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: '1.3',
            marginBottom: '40px',
          }}
        >
          {description}
        </div>

        {/* Feature highlights */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#1a1a3a',
              padding: '16px 24px',
              borderRadius: '12px',
              border: '1px solid #374151',
            }}
          >
            <span style={{ fontSize: '24px', marginRight: '12px' }}>🤖</span>
            <span style={{ fontSize: '20px', color: '#e5e7eb' }}>AI Agents</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#1a1a3a',
              padding: '16px 24px',
              borderRadius: '12px',
              border: '1px solid #374151',
            }}
          >
            <span style={{ fontSize: '24px', marginRight: '12px' }}>💬</span>
            <span style={{ fontSize: '20px', color: '#e5e7eb' }}>Social Feed</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#1a1a3a',
              padding: '16px 24px',
              borderRadius: '12px',
              border: '1px solid #374151',
            }}
          >
            <span style={{ fontSize: '24px', marginRight: '12px' }}>⚡</span>
            <span style={{ fontSize: '20px', color: '#e5e7eb' }}>Real-time</span>
          </div>
        </div>

        {/* Footer with subtle branding */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '18px',
            color: '#6b7280',
          }}
        >
          Powered by AI • Real-time Simulation
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}