<?php
if (isset($_GET['file'])) {
    $filePath = urldecode($_GET['file']); // Decode the URL-encoded file path
    $realPath = realpath($filePath); // Resolve the absolute path

    // Print the file path and real path for debugging purposes
    // echo "<p>Debug: File path is $filePath</p>";
    // echo "<br>";
    // echo "<p>Debug: Real path is $realPath</p>";
    // echo "<br>";

    if ($realPath && file_exists($realPath) && is_readable($realPath)) {
        $fileContent = file_get_contents($realPath);
        $hash = hash('sha256', $fileContent);

        // Optionally delete the file after signing
        unlink($realPath);

        echo "<!DOCTYPE html>";
        echo "<html lang='en'>";
        echo "<head>";
        echo "<meta charset='UTF-8'>";
        echo "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
        echo "<title>Document Signed Successfully</title>";
        echo "<link rel='stylesheet' href='css/encrypt-result.css'>";
        echo "</head>";
        echo "<body>";
        echo "<div class='container'>";
        echo "<h1>Document Signed Successfully</h1>";
        echo "<p>Signature: $hash</p>";
        echo "</div>";
        echo "</body>";
        echo "</html>";
    } else {
        echo "<p>File does not exist or is not readable.</p>";
    }
} else {
    echo "<p>No file specified.</p>";
}
?>
