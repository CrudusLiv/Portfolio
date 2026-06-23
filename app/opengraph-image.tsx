import { ImageResponse } from 'next/og'
import { bio } from '@/lib/data'

export const dynamic = 'force-static'
export const alt = `${bio.name} — Developer Portfolio`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#141210',
          backgroundImage:
            'radial-gradient(circle at 78% 28%, rgba(245,158,11,0.22), transparent 45%), radial-gradient(circle at 12% 88%, rgba(245,158,11,0.10), transparent 40%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '24px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#A8A29E',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '9999px',
              backgroundColor: '#F59E0B',
            }}
          />
          {bio.tagline}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              fontSize: '128px',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: '#F5F0E8',
            }}
          >
            {bio.name.split(' ')[0]}
          </div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#A8A29E',
            }}
          >
            {bio.name.split(' ').slice(1).join(' ')}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: '26px',
            color: '#F59E0B',
          }}
        >
          github.com/{bio.username}
        </div>
      </div>
    ),
    { ...size }
  )
}
