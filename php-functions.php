<?php

$second = 1;
$minute = 60;
$hour = 3600;
$day = 86400;
$week = 604800;
$month = 2592000;
$year = 31536000;

$protocols = array( 'http', 'https', 'ftp', 'ftps', 'mailto', 'news', 'irc', 'gopher', 'nntp', 'feed', 'telnet', 'mms', 'rtsp', 'svn', 'tel', 'fax', 'xmpp' );





function searchForSaturday($dayName = null)
{
    global $db;
    $nonWorkingDays = $db->queryAll("SELECT date FROM system_conf_non_working_dates");

    $nonWorkingDay = array();
    foreach ($nonWorkingDays as $key => $newDay) {
        $nonWorkingDay[] = date('d/m/Y', $newDay['date']);
    }

    $isLeapYear = date('L');
    $totalDays = 365;
    $ii = 1;
    if ($isLeapYear == 1) {
        $totalDays = 366;
    }

    $currentYearDay = date('z', time()) + 1;

    for ($i = $currentYearDay; $i <= $totalDays; $i++) {
        $d = mktime(0, 0, 0, 1, $i, date("Y"));
        $isThisTheDate = date("d/m/Y", $d);

        if ($dayName == date('D', $d)) {
            if (time() > strtotime('13:00:00')) {
                do {
                    $dateTime = DateTime::createFromFormat('d/m/Y', $isThisTheDate);
                    $dateTime->modify("+{$ii} day");
                    $dName = date('D', $dateTime->getTimestamp());
                    $isThisTheDate = date('d/m/Y', $dateTime->getTimestamp());

                } while (in_array($isThisTheDate, $nonWorkingDay) || $dName == 'Sun');
            }
            // if (in_array($isThisTheDate, $nonWorkingDay)) {
            // }

            return $isThisTheDate;
        }
    }
}

function searchForNextWorkingDay($dayName = 0)
{
    global $db;
    $dayName = (int) $dayName;
    $nonWorkingDays = $db->queryAll("SELECT date FROM system_conf_non_working_dates");
    $nonWorkingDay = array();
    if (count($nonWorkingDays) > 0) {
        foreach ($nonWorkingDays as $key => $newDay) {
            $nonWorkingDay[] = date('d/m/Y', $newDay['date']);
        }
    }

    $isLeapYear = date('L');
    $totalDays = 365;
    $isModified = false;
    if ($isLeapYear == 1) {
        $totalDays = 366;
    }

    $currentYearDay = date('z', time()) + 1;
    $currentDateName = date('D M', time());
    $currDate = date('d/m/Y', time());

    for ($i = $currentYearDay; $i <= $totalDays; $i++) {
        if ($dayName > 0) {
            $d = mktime(0, 0, 0, 1, $i, date("Y"));
            $dName = date('D', $d);
            $isThisTheDate = date("d/m/Y", $d);
            if (time() > strtotime('13:00:00')) {
                $dayName = $dayName + 1;
                $dateTime = DateTime::createFromFormat('d/m/Y', $isThisTheDate);
                $dateTime->modify("+{$dayName} days");
                $dName = date('D', $dateTime->getTimestamp());
                $isModified = true;
            }

           if ($dName != 'Sat' && $dName != 'Sun') {
                if (!in_array($isThisTheDate, $nonWorkingDay)) {
                    if (!$isModified) {
                        $dateTime = DateTime::createFromFormat('d/m/Y', $isThisTheDate);
                        $dateTime->modify("+{$dayName} days");
                    }

                    return $dateTime->format('d/m/Y');
                }
            }
        }
    }
}

echo searchForSaturday('Sat');
echo searchForNextWorkingDay('1');

/**
 * Get a protected/private method reflection for testing.
 *
 * @param object $obj The instantiated instance of your class
 * @param string $name The name of your protected/private method
 * @param array $args Arguments for the protected/private method
 *
 * @return ReflectionClass The method you asked for
 */
private static function getProtectedOrPrivateMethod($obj, $name, array $args) {
    $class = new ReflectionClass($obj);
    $method = $class->getMethod($name);
    $method->setAccessible(true);

    return $method->invokeArgs($obj, $args);
}

function prime($num) {
    $number = 2;
    $range = range(2, $num);
    $primes = array_combine($range, $range);

    while ($number*$number < $num) {
        for ($i = $number; $i <= $num; $i += $number) {
            if ($i == $number) {
                continue;
            }
            unset($primes[$i]);
        }
        $number = next($primes);
    }
    return $primes;
}

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

//recursive menu with inknown depth and one query

/**
     * Initialize menus and their submenus. 1 query to rule them all!
     *
     * @return void
     */
    private function initMenus()
    {
        $menu = $this->getTable("Menu")->fetchList(false, ["id", "caption", "class", "menulink", "parent"], ["active" => 1, "language" => $this->language()], "AND", null, "id, menuOrder");
        if (count($menu) > 0) {
            $menus = ['menus' => [], 'submenus' => []];
            foreach ($menu as $submenus) {
                $menus['menus'][$submenus->getId()] = $submenus;
                $menus['submenus'][$submenus->getParent()][] = $submenus->getId();
            }

            $this->getView()->menu = $this->generateMenu(0, $menus);
        }
        return $this->getView();
    }

    /**
     * Builds menu HTML.
     *
     * @method generateMenu
     *
     * @param int $parent
     * @param array $menu
     * @param string $role
     *
     * @return string generated html code
     */
    private function generateMenu($parent = 0, array $menu = [], $ariaRole = "menubar")
    {
        $output = "";
        $escaper = new \Zend\Escaper\Escaper('utf-8');
        if (isset($menu["submenus"][$parent])) {
            $output .= "<ul role='{$ariaRole}'>";

            /**
             * This is a really, really ugly hack
             */
            if ($this->menuIncrementHack === 0) {
                $output .= "<li role='menuitem'><a hreflang='{$this->language("languageName")}' itemprop='url' href='/'>{$this->translate("HOME")}</a></li>";
                $userData = $this->UserData();
                if ($userData->checkIdentity(false)) {
                    $output .= "<li role='menuitem'><a hreflang='{$this->language("languageName")}' itemprop='url' href='/login/logout'>{$this->translate("SIGN_OUT")}</a></li>";
                } else {
                    $output .= "<li role='menuitem'><a hreflang='{$this->language("languageName")}' itemprop='url' href='/login'>{$this->translate("SIGN_IN")}</a></li>";
                }
                $output .= "<li role='menuitem'><a hreflang='{$this->language("languageName")}' itemprop='url' href='/registration'>{$this->translate("SIGN_UP")}</a></li>";
            }
            $this->menuIncrementHack = 1;

            foreach ($menu['submenus'][$parent] as $id) {
                $output .= "<li role='menuitem'><a hreflang='{$this->language("languageName")}' itemprop='url' href='/menu/title/{$escaper->escapeUrl($menu['menus'][$id]->getMenuLink())}'><em class='fa {$menu['menus'][$id]->getClass()}'></em> {$menu['menus'][$id]->getCaption()}</a>";
                $output .= $this->generateMenu($id, $menu, "menu");
                $output .= "</li>";
            }
            $output .= "</ul>";
        }

        return $output;
    }

function calculate_score($votes, $item_hour_age, $gravity=1.8) {
    return ($votes - 1) / pow(($item_hour_age+2), $gravity);
  }
?>
