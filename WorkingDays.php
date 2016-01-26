<?php

/**
* Get all Working days for the current year
*/
class WorkingDays extends ArrayIterator implements Iterator
{
    /**
     * @var array
     */
    private $months = array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);

    /**
     * @var string
     */
    private $year;

    /**
     * Days to ignore no matter the month and year.
     * Where 0 = Sunday and 6 = Saturday
     *
     * @var array
     */
    private $ignoreWeekDays = array(0, 6);


    /**
     * Ignore specific dates can hold dates in format d-m-Y
     * that can be ignored
     *
     * @var array
     */
    private $ignoreSpecificDates = array();

    /**
     * @var string
     */
    private $workingDays;

    public function __construct($year = null, array $ignoreWeekDays = null, array $ignoreSpecificDates = null)
    {
        if (!is_string($year)) {
            $this->year = date("o", time());
        } else {
            $this->year = $year;
        }

        if (!empty($ignoreWeekDays)) {
            $this->ignoreWeekDays = $ignoreWeekDays;
        }

        if (!empty($ignoreSpecificDates)) {
            $this->ignoreSpecificDates = $ignoreSpecificDates;
        }

        if (!$this->workingDays) {
            $this->workingDays = $this->parseWorkingDays();
        }
    }

    /**
     * For each month get its working days: Monday - Friday.
     *
     * @return array
     */
    private function parseWorkingDays()
    {
        $i = 0;
        $data = array();
        foreach ($this->months as $month) {
            $counter = mktime(0, 0, 0, $month, 1, $this->year);
            while (date("n", $counter) == $month) {
                if (!in_array(date("w", $counter), $this->ignoreWeekDays)) {
                    $data[$i]['currentDate'] = date("d", time());
                    $data[$i]['date'] = date("d", $counter);
                    $data[$i]['dayName'] = date("l", $counter);
                    $data[$i]['month'] = date("M", $counter);
                    $data[$i]['year'] = date("o", $counter);
                    $data[$i]['search_date'] = date("d-m-o", $counter);
                    $i++;
                }
                $counter = strtotime("+1 day", $counter);
            }
        }

        if (!empty($this->ignoreSpecificDates)) {
            $data = $this->removeIgnoredSpecificDates($data);
        }

        return $data;
    }

    /**
     * @var array
     */
    private function removeIgnoredSpecificDates(array $dates)
    {
        foreach ($dates as $key => $date) {
            foreach ($this->ignoreSpecificDates as $key2 => $ignoredDate) {
                $ignoredDate = str_replace(array('/', '\\', '_'), '-', $ignoredDate);
                $search_date = date('d-m-o', strtotime($ignoredDate, true));
                if (in_array($search_date, $date)) {
                    unset($dates[$key]);
                }
            }
        }

        return $dates;
    }

    /**
     * @return array
     */
    public function getWorkingDays()
    {
        return $this->workingDays;
    }

    /**
     * @return void
     */
    public function rewind() {
        if ($this->workingDays instanceof Iterator) {
            $this->workingDays->rewind();
        } else {
            reset($this->workingDays);
        }
    }

    /**
     * @return array
     */
    public function current() {
        if ($this->workingDays instanceof Iterator) {
            return $this->workingDays->current();
        }

        return current($this->workingDays);
    }

    /**
     * @return int
     */
    public function key() {
        if ($this->workingDays instanceof Iterator) {
            return $this->workingDays->key();
        }

        return key($this->workingDays);
    }

    /**
     * @return array
     */
    public function next() {
        if ($this->workingDays instanceof Iterator) {
            return $this->workingDays->next();
        }

        return next($this->workingDays);
    }

    /**
     * @return int|bool
     */
    public function valid() {
        if ($this->workingDays instanceof Iterator) {
            return $this->workingDays->valid();
        }

        return key($this->workingDays) !== null;
    }

}

?>
