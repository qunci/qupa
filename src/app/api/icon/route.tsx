import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get('theme') || 'light';
  
  const fontData = fs.readFileSync(
    path.join(process.cwd(), 'public/fonts/AlienBlock-Regular.ttf')
  );

  const color = theme === 'dark' ? '#ffffff' : '#161b22';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          fontFamily: '"AlienBlock"',
          fontSize: 64,
          color: color,
          lineHeight: 1,
        }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: 60, justifyContent: 'flex-end', paddingRight: 4 }}>Q</div>
          <div style={{ display: 'flex', width: 60, justifyContent: 'flex-start', paddingLeft: 4 }}>U</div>
        </div>
        <div style={{ display: 'flex', marginTop: -4 }}>
          <div style={{ display: 'flex', width: 60, justifyContent: 'flex-end', paddingRight: 4 }}>P</div>
          <div style={{ display: 'flex', width: 60, justifyContent: 'flex-start', paddingLeft: 4 }}>A</div>
        </div>
      </div>
    ),
    {
      width: 128,
      height: 128,
      fonts: [
        {
          name: 'AlienBlock',
          data: fontData,
          style: 'normal',
        },
      ],
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
