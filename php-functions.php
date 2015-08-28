<?php

$second = 1;
$minute = 60;
$hour = 3600;
$day = 86400;
$week = 604800;
$month = 2592000;
$year = 31536000;

function bubbleSort(array $arr = [])
{
    $count = count($arr);
    if ($count <= 1) {
        return $arr;
    }

    for ($i = 0; $i < $count; $i++) {
        for ($j = $count - 1; $j > $i; $j--) {
            if ($arr[$j] < $arr[$j - 1]) {
                $tmp = $arr[$j];
                $arr[$j] = $arr[$j - 1];
                $arr[$j - 1] = $tmp;
            }
        }
    }

    return $arr;
}

function insertSort(array $arr = [])
{
    $count = count($arr);
    if ($count <= 1) {
        return $arr;
    }

    for ($i = 1; $i < $count; $i++) {
        $currentValue = $arr[$i];
        $j = $i - 1;

        while (isset($arr[$j]) && $arr[$j] > $currentValue) {
            $arr[$j + 1] = $arr[$j];
            $arr[$j] = $currentValue;
            $j--;
        }
    }

    return $arr;
}

function mergeSort(array $arr = [])
{
    $count = count($arr);
    if ($count <= 1) {
        return $arr;
    }

    $left  = array_slice($arr, 0, (int)($count/2));
    $right = array_slice($arr, (int)($count/2));

    $left = mergeSort($left);
    $right = mergeSort($right);

    return merge($left, $right);
}

function merge(array $left = [], array $right = [])
{
    $ret = array();
    if (count($left) <= 0) {
        return;
    }

    if (count($right) <= 0) {
        return;
    }

    while (count($left) > 0 && count($right) > 0) {
        if ($left[0] < $right[0]) {
            array_push($ret, array_shift($left));
        } else {
            array_push($ret, array_shift($right));
        }
    }

    array_splice($ret, count($ret), 0, $left);
    array_splice($ret, count($ret), 0, $right);

    return $ret;
}

//Quick Sorting
function quickSort(array $arr) {
    $count= count($arr);
    if ($count <= 1) {
        return $arr;
    }

    $first_val = $arr[0];
    $left_arr = array();
    $right_arr = array();

    for ($i = 1; $i < $count; $i++) {
        if ($arr[$i] <= $first_val) {
            $left_arr[] = $arr[$i];
        } else {
            $right_arr[] = $arr[$i];
        }
    }

    $left_arr = quickSort($left_arr);
    $right_arr = quickSort($right_arr);

    return array_merge($left_arr, array($first_val), $right_arr);
}

//Select Sorting
function selectSort(array $arr) {
    $count= count($arr);
    if ($count <= 1){
        return $arr;
    }

    for ($i = 0; $i < $count; $i++){
        $k = $i;

        for($j = $i + 1; $j < $count; $j++){
            if ($arr[$k] > $arr[$j]){
                $k = $j;
            }

            if ($k != $i){
                $tmp = $arr[$i];
                $arr[$i] = $arr[$k];
                $arr[$k] = $tmp;
            }
        }
    }

    return $arr;
}



?>