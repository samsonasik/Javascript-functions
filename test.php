<?php

// header("Content-type: application/json");
if (isset($_REQUEST['da'])) {
echo json_encode(array(
        'results1' => 1,
        'results2' => 2,
        'results3' => 3,
        'results4' => 4,
    ));
    die();
}

?>
