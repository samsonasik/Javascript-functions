<?php

// header("Content-type: application/xml");
// echo var_dump($_REQUEST);
if (isset($_REQUEST['da'])) {
// echo json_encode(array(
//         'results1' => 1,
//         'results2' => 2,
//         'results3' => 3,
//         'results4' => 4,
//     ));
//     die();
echo file_get_contents('test.xml');
}


?>
