---
abbrlink: ''
categories:
- - 前端
cover: ''
date: '2023-11-23T15:22:11.438790+08:00'
tags:
- vue
title: Vue+Ts自定义封装日期组件
updated: 2023-11-23T15:22:12.66+8:0
---
至于为啥不用组件库的日期组件而费劲的自己去封装一个勒？说多了都是泪，由于公司UI和常用的组件库的样式和一些操作交互有些差别，试了一通发现都不能实现业务需求，干脆手撸一个吧！

先来看看实现效果吧

[![pidTYWV.png](https://z1.ax1x.com/2023/11/23/pidTYWV.png)](https://imgse.com/i/pidTYWV)


[![pidTtzT.png](https://z1.ax1x.com/2023/11/23/pidTtzT.png)](https://imgse.com/i/pidTtzT)

[![pidTsF1.png](https://z1.ax1x.com/2023/11/23/pidTsF1.png)](https://imgse.com/i/pidTsF1)


话不多说直接上代码！

```javascript
<template>
  <div class="date-picker relative" ref="date_picker">
    <div
      class="input-date w-36 h-8 rounded overflow-hidden relative"
      :style="{ backgroundColor: '#2B2D3A' }"
    >
      <input
        type="text"
        class="border-none outline-none w-full h-full px-3"
        :style="{ backgroundColor: '#2B2D3A' }"
        placeholder="请选择日期"
        @blur="BlurHandel"
        @focus="FocusHandel"
        v-model="value"
      />
      <i
        class="iconfont cursor-pointer text-white absolute right-2 top-1/2 -translate-y-1/2"
        :class="icon"
        @mouseenter="iconMouenterHandel"
        @mouseleave="icon = 'icon-rili'"
        @click="iconClickHandel"
      ></i>
    </div>
    <div ref="calendar" class="calendar-card" v-show="isFoucus">
      <div class="flex w-full h-9 justify-between items-center" :style="{ color: '#000' }">
        <!-- 上一年 -->
        <button v-if="isPreYear" @click="minusYear(true)">
          <i class="iconfont icon-zuojiantou"></i>
        </button>
        <!-- 上一月 -->
        <button @click="minusMonth" v-if="isPreMonth"> < </button>
        <div class="_button" @mouseover="isYearShow = true" @mouseout="isYearShow = false">
          <span> {{ date.year }}年</span>
          <div class="box_year" v-show="isYearShow">
            <ul>
              <li
                :class="{ active: date.year === year }"
                v-for="(year, index) in yearList"
                :key="year"
                @click="clickCurrentYearHandel(year, index)"
                >{{ year }}</li
              >
            </ul>
          </div>
          <!-- {{ date.date }} -->
        </div>
        <div class="_button" @mouseover="isMouthShow = true" @mouseout="isMouthShow = false">
          <span> {{ (date.month as number) + 1 }}月</span>
          <div class="box_month" v-show="isMouthShow">
            <ul>
              <li
                :class="{ active: (date.month as number) + 1 === m }"
                v-for="(m, index) in monthList"
                :key="m"
                @click="clickCurrentMonthHandel(m, index)"
                >{{ m }}月</li
              >
            </ul>
          </div>
        </div>
        <!-- 下一月 -->
        <button @click="plusMonth" v-if="isNextMonth">></button>
        <!-- 下一年 -->
        <button @click="plusYear(true)" v-if="isNextYear">
          <i class="iconfont icon-youjiantou"></i>
        </button>
      </div>
      <div class="calendar-content">
        <ul class="ul-week">
          <li class="li-week" v-for="item in week" :key="item">{{ item }}</li>
        </ul>
        <ul class="ul-day">
          <li
            class="li-day"
            v-for="(item, index) in days"
            :key="index"
            :isThisMonth="item?.isThisMonth"
            @click="handleClick(item)"
          >
            {{ item?.date }}
          </li>
        </ul>
      </div>
      <div class="footer">
        <ul>
          <li @click="clearAllHandel">清空</li>
          <li @click="currentTodayHandel">今天</li>
          <li @click="okHandel">确定</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { unref, watch, computed, ref, reactive, onMounted, onUnmounted } from 'vue';
  import { Idate, IDateDate } from '../props';

  defineOptions({
    name: 'DatePicker',
  });

  defineProps({
    /*是否显示上一月箭头 */
    isPreMonth: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    /*是否显示下一月箭头 */
    isNextMonth: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    /*是否显示上一年箭头 */
    isPreYear: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    /*是否显示下一年箭头 */
    isNextYear: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  });

  const emit = defineEmits(['change', 'ok']);

  const isYearShow = ref(false);
  const isMouthShow = ref(false);
  const isActiveLi = ref<any>(null);
  const isActiveLiM = ref<any>(null);
  const isFoucus = ref(false);
  const value = ref<string | undefined>('');
  const calendar = ref(null);
  const date_picker = ref(null);
  const icon = ref('icon-rili');

  const monthList = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  const date: Idate = reactive({
    year: '',
    month: '',
    date: '',
    h: 0,
    m: 0,
    s: 0,
  });

  const current: Idate = reactive({
    year: '',
    month: '',
    date: '',
    h: 0,
    m: 0,
    s: 0,
  });

  const yearList = computed(() => {
    let d = new Date();
    let list: Array<number> = [d.getFullYear() as number];
    for (let i = 1; i < 10; i++) {
      list.push((d.getFullYear() as number) - i);
    }
    return list;
  });

  const week = ['日', '一', '二', '三', '四', '五', '六'];

  const days = ref<Array<Idate>>([]);

  const cache = ref('');

  const bodyClickHandel = (e: MouseEvent) => {
    if ((date_picker.value as unknown as HTMLElement).contains(e.target as HTMLElement)) {
      return;
    }
    if (isFoucus.value) {
      console.log('关闭');
      close();
    }
  };

  onMounted(() => {
    initDate();
    document.body.addEventListener('click', bodyClickHandel);
  });

  onUnmounted(() => {
    document.body.removeEventListener('click', bodyClickHandel);
  });

  /**
   * 初始化日期（年月日）
   */
  const initDate = () => {
    let d = new Date();
    date.year = d.getFullYear();
    date.month = d.getMonth();
    date.date = d.getDate();

    current.year = d.getFullYear();
    current.month = d.getMonth();
    current.date = d.getDate();

    createCalendar(current.year, current.month);
  };

  /**
   * 初始化时间（时分秒）
   */
  const initTime = () => {
    let d = new Date();
    date.h = d.getHours();
    date.m = d.getMinutes();
    date.s = d.getMilliseconds();

    current.h = d.getHours();
    current.m = d.getMinutes();
    current.s = d.getMilliseconds().toString().padStart(3, '0').slice(0, 2);
  };

  /**
   * 格式话时间
   */
  const getCurrentTime = (hours, minutes, seconds) => {
    let strDate = '';
    if (!hours && !minutes && !seconds) {
      const now = new Date();
      let hours: number | string = now.getHours();
      let minutes: number | string = now.getMinutes();
      let seconds: number | string = now.getSeconds();
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      strDate = `${hours}:${minutes}:${seconds}`;
    } else if (hours && minutes && seconds) {
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      strDate = `${hours}:${minutes}:${seconds}`;
    }

    return strDate;
  };

  /**
   * 校验日期格式
   */
  const checkDateFormat = (dateString: string) => {
    const pattern = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return pattern.test(dateString);
  };

  /**
   * 需要返回的日期数据
   */
  const selectDate = computed(() => {
    if (!current.date) return null;
    return {
      $d: new Date(
        `${current.year}-${
          current.month.toString().length <= 1
            ? '0' + ((current.month as number) + 1).toString()
            : (current.month as number) + 1
        }-${
          current.date.toString().length <= 1 ? '0' + current.date.toString() : current.date
        } ${getCurrentTime(current.h, current.m, current.s)}`,
      ),
      $Y: current.year,
      $M: current.month,
      $D: current.date,
      $H: current.h,
      $m: current.m,
      $s: current.s,
      $date: `${current.year}-${
        current.month.toString().length <= 1
          ? '0' + ((current.month as number) + 1).toString()
          : (current.month as number) + 1
      }-${current.date.toString().length <= 1 ? '0' + current.date.toString() : current.date}`,
      $time: getCurrentTime(current.h, current.m, current.s),
    } as IDateDate;
  });

  watch(
    () => selectDate.value,
    (o) => {
      emit('change', o);
    },
  );

  /**
   * 监听输入变化 更新日期并重新渲染
   */
  watch(
    () => value.value,
    (v: any) => {
      if (!checkDateFormat(v)) return;

      cache.value = v;

      let d = new Date(v);
      current.year = d.getFullYear();
      current.month = d.getMonth();
      current.date = d.getDate();

      date.year = d.getFullYear();
      date.month = d.getMonth();
      date.date = d.getDate();
      createCalendar(current.year, current.month);
    },
  );

  /**
   * 有值 hover时显示清楚按钮
   */
  const iconMouenterHandel = () => {
    if (unref(value)) {
      icon.value = 'icon-chacha';
    }
  };

  /**
   * 点击清楚
   */
  const iconClickHandel = () => {
    value.value = '';
    clearAllHandel();
  };

  /**
   * 失去焦点
   */
  const BlurHandel = () => {
    if (!checkDateFormat(unref(value) as string)) {
      if (cache.value) {
        value.value = unref(cache);
      } else {
        value.value = '';
      }
    }
  };

  /**
   * 获取焦点
   */
  const FocusHandel = () => {
    isFoucus.value = true;
    (calendar.value as unknown as HTMLElement).style.animation = 'fade .3s forwards';
  };

  /**
   * 点击日历 天
   */
  const handleClick = (item: Idate) => {
    current.year = item.year;
    current.month = item.month;
    current.date = item.date;
    current.h = '23';
    current.m = '59';
    current.s = '59';
    createCalendar(item.year, item.month);
  };

  /**
   * 选择年
   */
  const clickCurrentYearHandel = (cur: number, index: number) => {
    isActiveLi.value = index;
    (date.year as number) = cur;
    createCalendar(date.year, date.month);
  };

  /**
   * 选择月
   */
  const clickCurrentMonthHandel = (cur: number, index: number) => {
    isActiveLiM.value = index;
    (date.month as number) = cur - 1;
    createCalendar(date.year, date.month);
  };

  /**
   * 清空
   */
  const clearAllHandel = () => {
    current.date = '';
    current.h = 0;
    current.m = 0;
    current.s = 0;
    createCalendar(current.year, current.month);
    okHandel();
  };

  /**
   * 关闭
   */
  const close = () => {
    setTimeout(() => {
      (calendar.value as unknown as HTMLElement).style.animation = 'fade_up .4s forwards';
    }, 150);
    setTimeout(() => {
      isFoucus.value = false;
    }, 500);
  };

  /**
   * 点击今天
   */
  const currentTodayHandel = () => {
    initDate();
    initTime();
    okHandel();
  };

  /**
   * 点击确认
   */
  const okHandel = () => {
    close();
    emit('ok', selectDate.value);
    value.value = selectDate.value?.$date;
  };

  /**
   * 下一月
   */
  const plusMonth = () => {
    // 月数到12 加一年
    if (date.month === 11) {
      date.month = 0;
      plusYear(false);
    } else {
      (date.month as number)++;
    }
    createCalendar(date.year, date.month);
  };

  /**
   * 上一月
   */
  const minusMonth = () => {
    // 月数到0 减一年
    if (date.month === 0) {
      date.month = 11;
      minusYear(false);
    } else {
      (date.month as number)--;
    }
    createCalendar(date.year, date.month);
  };

  /**
   * 下一年
   */
  const plusYear = (create) => {
    if (date.year === 2099) {
      date.year = 1970;
    } else {
      (date.year as number)++;
    }
    if (create) {
      createCalendar(date.year, date.month);
    }
  };

  /**
   * 上一年
   */
  const minusYear = (create) => {
    if (date.year == 1970) {
      date.year = 2099;
    } else {
      (date.year as number)--;
    }
    if (create) {
      createCalendar(date.year, date.month);
    }
  };

  /**
   * 创建日历表
   */
  const createCalendar = (year: string | number, month: string | number) => {
    let d = new Date();
    d.setFullYear(year as number);
    d.setMonth(month as number);
    d.setDate(1);
    let dayOfFirstDay = d.getDay();
    days.value = [];

    for (let i = 0; i < 42; i++) {
      d.setDate(1);
      d.setMonth(month as number);
      d.setDate(i - dayOfFirstDay + 1);

      let isThisMonth = 1;
      if (d.getMonth() == month) {
        isThisMonth = 2;
      } else {
        isThisMonth = 1;
      }

      if (
        current.date == d.getDate() &&
        current.month == d.getMonth() &&
        current.year == d.getFullYear()
      ) {
        isThisMonth = 3;
        let date: Idate = {
          year: year,
          month: month,
          date: d.getDate(),
          isThisMonth: isThisMonth,
        };
        days.value.push(date);
      } else {
        let date = {
          year: d.getFullYear(),
          month: d.getMonth(),
          date: d.getDate(),
          isThisMonth: isThisMonth,
        };

        days.value.push(date);
      }
    }
  };
</script>

<style>
  /* stylelint-disable-next-line keyframes-name-pattern */
  @keyframes fade_up {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes fade {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
</style>

<style scoped lang="less">
  .calendar-card {
    @keyframes fade {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    position: absolute;
    z-index: 999;
    top: 40px;
    left: 50%;
    width: 310px;
    height: 293px;
    padding: 0 10px;
    transform: translateX(-50%);
    animation: fade 0.5s forwards;
    border: 1px solid #ebeef5;
    border-radius: 10px;
    background-color: #fff;

    ._button {
      position: relative;
      padding: 5px 8px;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: #e7ebf5;
      }

      .box_year,
      .box_month {
        position: absolute;
        z-index: 9;
        top: 18px;
        left: 50%;
        width: 114px;
        height: 159px;
        padding-top: 10px;
        transform: translateX(-50%);
        animation: fade 0.3s forwards;

        ul {
          display: flex;
          flex-wrap: wrap;
          height: 156px;
          padding: 16px;
          border: 1px solid #d3d3dd;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 3px 7px 0 #ddd8d8;

          li {
            width: 36px;
            height: 22px;
            margin-right: 5px;
            margin-bottom: 4px;
            color: #000;
            line-height: 22px;
            text-align: center;

            &:hover {
              border-radius: 5px;
              background-color: #e7ebf5;
            }

            &.active {
              border-radius: 5px;
              background-color: #1c67e5;
              color: #fff;
              // font-size: 12px;
            }

            &:nth-child(2n) {
              margin-right: 0;
            }
          }
        }
      }

      .box_month {
        width: 114px;
        height: 178px;

        ul {
          height: 178px;
        }
      }
    }

    > div {
      button {
        background-color: transparent !important;
        cursor: pointer;

        &:hover {
          background-color: #e7ebf5;
        }
      }
    }
  }

  .footer {
    margin-top: 5px;
    color: #000;

    ul {
      display: flex;
      justify-content: end;
      margin-right: 10px;
      margin-bottom: 0;

      li {
        margin-left: 10px;
        padding: 3px 8px;
        border: 1px solid #999;
        border-radius: 5px;
        font-size: 12px;
        cursor: pointer;

        &:last-child {
          background-color: #1c67e5;
          color: #fff;
        }
      }
    }
  }

  .calendar-bar {
    height: 40px;
    color: #727272;
    line-height: 40px;
    text-align: center;

    /* background-color: #ebeef5; */
    button {
      i {
        color: #333;
      }
    }
  }

  .button {
    border: none;
    background-color: transparent;
  }

  .button:hover {
    background-color: #eee;
    cursor: pointer;
  }

  .ul-week {
    display: flex;
    justify-content: space-between;
    width: 100%;
    // margin: 5px 20px;
    margin: 0;
    margin: 8px 0;
    padding: 0 10px;
    // border-bottom: 1px solid #eee;
    color: #000;
    font-size: 13px;
    list-style: none;
    text-align: center;
  }

  .li-week {
    display: inline-block;
  }

  .ul-day {
    display: grid;
    grid-template-columns: repeat(7, 30px);
    grid-template-rows: repeat(6, 30px);
    align-items: start;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0;
    list-style: none;
    text-align: center;
  }

  .li-day {
    display: inline-block;
    margin: 1px;
    border-radius: 5px;
    color: #000;
    font-size: 13px;
    line-height: 25px;
    text-align: center;
  }

  .li-day:hover {
    background-color: #1c67e5;
    color: #fff;
    cursor: pointer;
  }

  .li-day[isThisMonth='1'] {
    color: rgb(190 190 190);
    font-size: 13px;
  }

  .li-day[isThisMonth='1']:hover {
    background-color: #1c67e5;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
  }

  .li-day[isThisMonth='3'] {
    border-radius: 5px;
    background-color: #1c67e5;
    color: rgb(255 255 255);
    font-weight: 600;
  }
</style>

```

`props`文件

```javascript
export interface Idate {
  year: string | number;
  month: string | number;
  date: string | number;
  isThisMonth?: any;
  h?: number | string;
  m?: number | string;
  s?: number | string;
}

export interface IDateDate {
  /**时间 Date格式 */
  $d: Date;
  /**年*/
  $Y: string | number;
  /**月*/
  $M: string | number;
  /**日*/
  $D: string | number;
  /**时*/
  $H: string | number;
  /**分*/
  $m: string | number;
  /**秒*/
  $s: string | number;
  /**日期 年月日*/
  $date: string;
  /**时间 时分秒*/
  $time: string;
}

```

其中有一些样式用到了windcss 使用前可以先装一下哦 不然会有的变形不想装的也可以自己补下css

用法

```javascript
  <DatePicker class="mr-4" @change="datePickerChangeHandel" @ok="okHandel" />
```

然后数据是这样的


[![pid7V0J.png](https://z1.ax1x.com/2023/11/23/pid7V0J.png)](https://imgse.com/i/pid7V0J)
