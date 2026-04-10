export const welcomeTemplate = (
  name: string,
  phone: string,
  pin: string
) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Sanraj Software Solutions</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 40px 20px;
      background: #ffffff;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    
    .email-container {
      max-width: 580px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .gradient-bg {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    }
    
    .pin-display {
      background: #ffffff;
      border-radius: 16px;
      padding: 16px 20px;
      font-family: 'Courier New', 'SF Mono', monospace;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #4f46e5;
      text-align: center;
      border: 2px solid #e2e8f0;
      user-select: all;
    }
    
    @media only screen and (max-width: 600px) {
      body {
        padding: 20px 16px;
      }
      .email-container {
        margin: 0;
        border-radius: 24px;
      }
      .pin-display {
        font-size: 24px;
        letter-spacing: 5px;
        padding: 12px 16px;
      }
    }
  </style>
</head>
<body>
  <div align="center">
    <div class="email-container">
      
      <!-- Header Section -->
      <div class="gradient-bg" style="padding: 40px 30px 35px 30px; text-align: center;">
        <h1 style="color: white; font-size: 34px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Sanraj</h1>
        <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin-top: 8px; letter-spacing: 2px; font-weight: 500;">SOFTWARE SOLUTIONS</p>
      </div>
      
      <!-- Welcome Hero Section -->
      <div style="padding: 35px 35px 0 35px; text-align: center;">
        <div style="background: #f8fafc; border-radius: 24px; padding: 32px 24px;">
          <div style="font-size: 52px; margin-bottom: 12px;">🎉</div>
          <h2 style="color: #1e293b; font-size: 26px; font-weight: 700; margin: 0;">
            Welcome, <span style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); -webkit-background-clip: text; background-clip: text; color: transparent;">${name}</span>!
          </h2>
          <p style="color: #64748b; margin-top: 12px; line-height: 1.6; font-size: 15px;">
            Your account has been successfully created. You're now part of India's fastest-growing software ecosystem.
          </p>
        </div>
      </div>
      
      <!-- Credentials Card -->
      <div style="padding: 30px 35px;">
        <div style="background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
          
          <!-- Mobile Number Row - FULLY CENTERED -->
          <div style="padding: 22px 25px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 12px; text-align: center;">
            <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap; justify-content: center;">
              <div style="width: 44px; height: 44px; background: #eef2ff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 22px;">📱</span>
              </div>
              <div style="text-align: center;">
                <p style="color: #94a3b8; font-size: 11px; font-weight: 600; letter-spacing: 1px; margin: 0;">REGISTERED MOBILE</p>
                <p style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 4px 0 0 0;">${phone}</p>
              </div>
            </div>
          </div>
          
          <!-- PIN Row - CENTERED (no copy button) -->
          <div style="padding: 22px 25px; background: #fffbeb;">
            <!-- SECURE PIN and Keep this confidential - FULLY CENTERED -->
            <div style="text-align: center; margin-bottom: 18px;">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
                <div style="width: 44px; height: 44px; background: #ffedd5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 4px;">
                  <span style="font-size: 22px;">🔐</span>
                </div>
                <p style="color: #92400e; font-size: 11px; font-weight: 700; letter-spacing: 1px; margin: 0;">SECURE PIN</p>
                <p style="color: #b45309; font-size: 12px; margin: 0;">Keep this confidential</p>
              </div>
            </div>
            
            <!-- PIN Display only -->
            <div class="pin-display">
              ${pin}
            </div>
            
            <p style="color: #92400e; font-size: 11px; margin-top: 18px; text-align: center; font-weight: 500;">
              ⚠️ Never share your PIN with anyone, including Sanraj support staff
            </p>
          </div>
        </div>
      </div>
      
      <!-- App Download Section -->
      <div style="padding: 10px 35px 30px 35px;">
        <div style="background: #f8fafc; border-radius: 24px; padding: 28px 24px; text-align: center; border: 1px solid #e2e8f0;">
          <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0 0 16px 0;">📲 Download Mobile App</p>
          <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <a href="https://play.google.com/store/apps/details?id=com.anonymous.sri" style="display: inline-block;" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" width="140" style="width:140px; height:auto;">
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 18px;">Available on Android  • Real-time sync • Push notifications</p>
        </div>
      </div>
      
    </div>
  </div>
</body>
</html>
  `;
};