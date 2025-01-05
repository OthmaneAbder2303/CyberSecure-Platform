<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['document'])) {
        $file = $_FILES['document'];
        $uploadDir = realpath('/uploads') . '/'; // Resolve the absolute path
        $uploadFile = $uploadDir . basename($file['name']);

        // Print the upload file path for debugging purposes
        echo "<p>Debug: Upload file path is $uploadFile</p>";

        if (move_uploaded_file($file['tmp_name'], $uploadFile)) {
            // Encode the file path to handle special characters
            $encodedFilePath = urlencode($uploadFile);
            header('Location: /sign-document.php?file=' . $encodedFilePath);
        } else {
            echo "Failed to upload file.";
        }
    } else {
        echo "No file uploaded.";
    }
}
?>
