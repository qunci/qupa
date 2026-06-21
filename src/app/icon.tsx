import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const size = { width: 128, height: 128 };
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
          fontSize: 64,
          color: '#0969da', // GitHub Accent Blue (visible on dark and light)
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
