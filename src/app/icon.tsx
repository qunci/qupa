import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  const fontData = fs.readFileSync(
    path.join(process.cwd(), 'public/fonts/AlienBlock-Regular.ttf')
  );

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
          fontSize: 32,
          color: '#161b22', // slate-900
          lineHeight: 1,
        }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: 30, justifyContent: 'flex-end', paddingRight: 2 }}>Q</div>
          <div style={{ display: 'flex', width: 30, justifyContent: 'flex-start', paddingLeft: 2 }}>U</div>
        </div>
        <div style={{ display: 'flex', marginTop: -2 }}>
          <div style={{ display: 'flex', width: 30, justifyContent: 'flex-end', paddingRight: 2 }}>P</div>
          <div style={{ display: 'flex', width: 30, justifyContent: 'flex-start', paddingLeft: 2 }}>A</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'AlienBlock',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  );
}
