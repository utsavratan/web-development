function reminderEmail({ username, userProfilePic, taskTitle, taskTime }) {
return `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background:#ffffff; font-family:Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
<tr>
<td align="center" style="padding:30px 10px;">

<table width="600" cellpadding="0" cellspacing="0"
style="max-width:600px;width:100%;border:1px solid #d1d5db;border-radius:12px;overflow:hidden;">

<tr>
<td align="center" bgcolor="#f3f4f6" style="padding:18px;">
<img src="https://github.com/user-attachments/assets/160c433a-e006-42ee-8923-f6360223e116" width="120">
</td>
</tr>

<tr>
<td align="center">
<table width="90%" cellpadding="0" cellspacing="0"
style="background:#f5f5f5;border-radius:16px;padding:20px;">

<tr>
<td style="font-size:16px;color:#555;">Upcoming Task</td>
</tr>

<tr>
<td style="font-size:18px;font-weight:bold;color:#111;">
${taskTitle}
</td>
</tr>

<tr>
<td style="border-top:1px solid #ddd;padding-top:12px;"></td>
</tr>

<tr>
<td style="font-size:16px;color:#555;">Starts At</td>
</tr>

<tr>
<td style="font-size:16px;font-weight:bold;">
${taskTime}
</td>
</tr>

</table>
</td>
</tr>

<tr>
<td align="center" style="padding:30px 40px 10px 40px;font-size:16px;color:#444;">
This is a reminder that your task will begin in 10 minutes.
Stay prepared and complete it on time.
</td>
</tr>

<tr>
<td align="center" style="padding:10px 0 20px 0;">
<div style="background:#4f7cff;color:#fff;font-size:20px;font-weight:bold;padding:16px 30px;border-radius:14px;">
Reminder Active
</div>
</td>
</tr>

<tr>
<td bgcolor="#000000" style="padding:20px;color:#fff;">
&copy; 2026 THRYLOS. All rights reserved.
</td>
</tr>

</table>
</td>
</tr>
</table>

</body>
</html>
`;
}

module.exports = reminderEmail;