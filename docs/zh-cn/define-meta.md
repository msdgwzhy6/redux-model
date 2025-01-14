
# 定义Meta
Meta本质上也是保存在reducer的数据，它记录了每个Request Action的当前状态。比如http的状态、请求错误时的信息，以及当前Action是否正在请求（loading）
```typescript
// 请求前 false
console.log(thirdModel.getProfile.meta.loading)

thirdModel.getProfile(1)
    .then(() => {
        // 请求成功，正常拿数据
    })
    .catch(() => {
        // 请求失败，从service中收集信息
        console.log(thirdModel.getProfile.meta.errorMessage)
    })
    .finally(() => {
        // 请求结束 false
        console.log(thirdModel.getProfile.meta.loading)
    });

// 请求中 true
console.log(thirdModel.getProfile.meta.loading)
```

### 关闭Meta

默认情况，meta是开启的。并不是每个请求action都需要记录meta，你可以手动关闭它。关闭之后，你无法再获取当前Action的meta数据
```typescript
getProfile = service.action(() => {
    return this.get('').withMeta(false);
});
```

### 使用Loading
Loading是存储的在Meta中一个属性，因为经常会被用到，所以我们定义了快捷方式去拿
```typescript
const loading = thirdModel.getProfile.loading;
```

### 在Hooks中使用
在React的hooks组件中，我们需要使用`use`前缀去获取meta
```typescript
const myMeta = thirdModel.getProfile.useMeta();
const myCode = thirdModel.getProfile.useMeta('businessCode');

const loading = thirdModel.getProfile.useLoading();
```
