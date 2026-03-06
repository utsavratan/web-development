function completionEmail({ username, userProfilePic, taskTitle }) {
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
<td align="center" style="padding:20px;">
<h1 style="font-size:32px;margin:0;font-weight:800;color:#16a34a;">
Task Completed 🎉
</h1>
</td>
</tr>

<tr>
<td align="center">
<table width="90%" cellpadding="0" cellspacing="0"
style="background:#f5f5f5;border-radius:16px;padding:20px;">

<tr>
<td style="font-size:16px;color:#555;">You successfully finished:</td>
</tr>

<tr>
<td style="font-size:20px;font-weight:bold;color:#111;">
${taskTitle}
</td>
</tr>

</table>
</td>
</tr>

<tr>
<td align="center" style="padding:30px;font-size:16px;color:#444;">
Great work ! Keep maintaining your productivity streak 🚀
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

module.exports = completionEmail;