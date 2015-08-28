<?php

error_reporting(E_ALL);

ini_set("log_errors", 1);

/**
 * Display of all other errors
 */
ini_set("display_errors", 1);

/**
 * Display of all startup errors
 */
ini_set("display_startup_errors", 1);

$content = '
<div class="article">
  <h1>heading</h1>
  <p>paragraph</p>
  <img src="/images/img-1.jpg" alt="alt for image">
</div>
';

$domDocument = new DOMDocument();
$domDocument->loadHTML($content);
$domElemsToRemove = [];

$domXpath = new DOMXpath($domDocument);
$nodes = $domXpath->query('//div[@class="article"]/img');


$newNode ="<div style='background: transparent url(/images/img-1.jpg) no-repeat; width: inherit; height: inherit; background-position: center center; background-size: cover; width: 566px; height: 576px;'>alt for new image</div>";
$newDom = $domDocument->createDocumentFragment();
$newDom->appendXML($newNode);


    foreach ($nodes as $node) {
        $node->parentNode->appendChild($newDom);
        $node->parentNode->removeChild($node);
    }

echo $domDocument->saveHTML();
?>