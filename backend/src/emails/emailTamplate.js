export const createWelcomeEmailTemplate = (userName, clientUrl) => {
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  const safeUserName = escapeHtml(userName);
  const safeClientUrl = escapeHtml(clientUrl);
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e6e6e6; border-radius: 12px; overflow: hidden;">
      
      <!-- Header -->
      <div style="background-color: #4A90E2; padding: 40px; text-align: center; color: #ffffff;">
        <!-- You can replace this with your logo -->
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Welcome to Unit-Chat!</h1>
        <p style="margin-top: 8px; font-size: 16px;">We're so excited to have you on board.</p>
      </div>
      
      <!-- Body -->
      <div style="padding: 30px 40px;">
        <h2 style="font-size: 22px; color: #333; margin-top: 0;">Hi ${safeUserName},</h2>
        <p style="font-size: 16px; color: #555;">Thank you for signing up. We're on a mission to make communication seamless and efficient, and we're thrilled you're joining us on this journey.</p>
        
        <!-- Getting Started -->
        <div style="margin-top: 30px; border-top: 1px solid #e6e6e6; padding-top: 30px;">
          <h3 style="font-size: 18px; color: #333; margin-top: 0;">Here’s how to get started:</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0; color: #555;">
            <li style="margin-bottom: 15px;"><strong>1. Complete Your Profile:</strong> Add a photo and a short bio to let others know who you are.</li>
            <li style="margin-bottom: 15px;"><strong>2. Create or Join a Channel:</strong> Start a conversation about a topic you're passionate about.</li>
            <li style="margin-bottom: 15px;"><strong>3. Invite Your Team:</strong> Collaboration is better with friends. Invite your colleagues to join you.</li>
          </ul>
        </div>
        
        <!-- Call to Action -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${safeClientUrl}" style="background-color: #4A90E2; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">Take Me to My Account</a>
        </div>
        
        <p style="font-size: 16px; color: #555;">If you have any questions, just reply to this email. We're always happy to help.</p>
        
        <p style="font-size: 16px; color: #555; margin-top: 20px;">Cheers,<br>The Unit-Chat Team</p>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f7f7f7; padding: 30px 40px; text-align: center; color: #888; border-top: 1px solid #e6e6e6;">
        <p style="margin: 0 0 10px 0;">Follow us on social media!</p>
        <div style="margin-bottom: 20px;">
          <!-- Replace # with your actual social media links -->
          <a href="#" style="text-decoration: none; margin: 0 8px;"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Facebook_f_logo_%282021%29.svg/1200px-Facebook_f_logo_%282021%29.svg.png" alt="Facebook" width="24" height="24"></a>
          <a href="#" style="text-decoration: none; margin: 0 8px;"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png" alt="Twitter" width="24" height="24"></a>
          <a href="#" style="text-decoration: none; margin: 0 8px;"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png" alt="Instagram" width="24" height="24"></a>
        </div>
        <p style="font-size: 12px; margin: 0;">© 2025 Unit-Chat. All rights reserved.</p>
        <p style="font-size: 12px; margin: 10px 0 0 0;">123 Chat Street, Message City, 12345</p>
        <p style="font-size: 12px; margin-top: 10px;"><a href="#" style="color: #4A90E2; text-decoration: none;">Unsubscribe</a></p>
      </div>
      
    </div>
  `;
};
