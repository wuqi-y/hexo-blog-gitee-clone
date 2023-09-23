const arr = [1, 2, 3];

// 获取数组原型链上的某个方法（例如：Array.prototype.push）
const originalMethod = Array.prototype.push;

// 定义自定义的 setter 函数
const defineCustomSetter = (obj, prop, method) => {
  Object.defineProperty(obj, prop, {
    get() {
      // return method;
    },
    set(value) {
      // method.call(this, value);
      arr[prop] = value
      console.log(`Array modified: ${prop} = ${value}`);
    }
  });
};

// Object.defineProperty(arr, 'push', {
//   get (q) {
//     console.log('get');
//     return 1
//   },
//   set (v) {
//     console.log('set');
//   }
// })

// 将自定义 setter 应用到数组的索引操作中
// defineCustomSetter(arr, '0', originalMethod);
// defineCustomSetter(arr, '1', originalMethod);
defineCustomSetter(arr, '0');

arr[0] = 10; // Array modified: 0 = 10
arr[1] = 20; // Array modified: 1 = 20
console.log(arr);
