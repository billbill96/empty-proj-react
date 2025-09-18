<template>
  <div class="relative inline-block">
    <input
      type="text"
      readonly
      :value="formattedDate"
      @click="toggleCalendar"
      placeholder="Select date"
      class="w-40 p-2 border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div v-if="showCalendar" class="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-50 p-4">
      <!-- header -->
      <div class="flex justify-between items-center mb-2">
        <button @click="prevMonth" class="p-1 hover:bg-gray-200 rounded">&lt;</button>
        <span class="font-medium">{{ currentMonthName }} {{ currentYear }}</span>
        <button @click="nextMonth" class="p-1 hover:bg-gray-200 rounded">&gt;</button>
      </div>
      <!-- weekdays -->
      <div class="grid grid-cols-7 text-center mb-1">
        <span v-for="day in weekdays" :key="day" class="font-semibold text-gray-700">{{ day }}</span>
      </div>
      <!-- days -->
      <div class="grid grid-cols-7 text-center">
        <span
          v-for="day in calendarDays"
          :key="day.date"
          @click="selectDate(day)"
          :class="[
            'p-2 cursor-pointer rounded-full',
            { 'text-gray-400': day.otherMonth },
            { 'bg-blue-500 text-white': isSelected(day) },
            { 'hover:bg-blue-100': !day.otherMonth }
          ]"
        >
          {{ day.date.getDate() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'Datepicker',
  setup() {
    const selectedDate = ref(null);
    const showCalendar = ref(false);
    const today = new Date();
    const currentMonth = ref(today.getMonth());
    const currentYear = ref(today.getFullYear());

    const formattedDate = computed(() =>
      selectedDate.value ? selectedDate.value.toLocaleDateString() : ''
    );

    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const daysInMonth = (year, month) =>
      new Date(year, month + 1, 0).getDate();

    const calendarDays = computed(() => {
      const days = [];
      const firstDayOfWeek = new Date(
        currentYear.value,
        currentMonth.value,
        1
      ).getDay();
      // previous month days
      const prevMonthDays = daysInMonth(
        currentYear.value,
        currentMonth.value - 1
      );
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        days.push({
          date: new Date(
            currentYear.value,
            currentMonth.value - 1,
            prevMonthDays - i
          ),
          otherMonth: true,
        });
      }
      // current month days
      const thisMonthDays = daysInMonth(
        currentYear.value,
        currentMonth.value
      );
      for (let i = 1; i <= thisMonthDays; i++) {
        days.push({ date: new Date(currentYear.value, currentMonth.value, i), otherMonth: false });
      }
      // next month days (fill to 6 weeks grid)
      const nextDays = 42 - days.length;
      for (let i = 1; i <= nextDays; i++) {
        days.push({ date: new Date(currentYear.value, currentMonth.value + 1, i), otherMonth: true });
      }
      return days;
    });

    const currentMonthName = computed(() =>
      new Date(currentYear.value, currentMonth.value).toLocaleString('default', { month: 'long' })
    );

    const toggleCalendar = () => (showCalendar.value = !showCalendar.value);
    const prevMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
      } else currentMonth.value--;
    };
    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
      } else currentMonth.value++;
    };
    const selectDate = (day) => {
      if (day.otherMonth) return;
      selectedDate.value = day.date;
      showCalendar.value = false;
    };
    const isSelected = (day) =>
      selectedDate.value &&
      day.date.toDateString() === selectedDate.value.toDateString();

    return {
      formattedDate,
      showCalendar,
      weekdays,
      calendarDays,
      currentMonthName,
      currentYear,
      toggleCalendar,
      prevMonth,
      nextMonth,
      selectDate,
      isSelected,
    };
  },
};
</script>