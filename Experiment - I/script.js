function welcomeAlert() {
    alert("Thank you for visiting my portfolio!");
}
function submitForm(event) {
    event.preventDefault();
    document.getElementById("msg").innerText = "Message submitted successfully!";
}