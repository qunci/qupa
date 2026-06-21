import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const size = { width: 180, height: 180 };
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
          background: '#0969da', // GitHub Accent Blue background
          fontFamily: '"AlienBlock"',
          fontSize: 90,
          color: '#ffffff', // White text
          lineHeight: 1,
        }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: 85, justifyContent: 'flex-end', paddingRight: 6 }}>Q</div>
          <div style={{ display: 'flex', width: 85, justifyContent: 'flex-start', paddingLeft: 6 }}>U</div>
        </div>
        <div style={{ display: 'flex', marginTop: -6 }}>
          <div style={{ display: 'flex', width: 85, justifyContent: 'flex-end', paddingRight: 6 }}>P</div>
          <div style={{ display: 'flex', width: 85, justifyContent: 'flex-start', paddingLeft: 6 }}>A</div>
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
