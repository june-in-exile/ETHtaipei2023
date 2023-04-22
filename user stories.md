```
Feature: 註冊
    As a 車主
    I want 在合約上註冊或修改車號跟錢包資訊
    So that 之後可以使用合約

    Given 我在 app
    When 在「建立資訊」欄位輸入(車號 && 錢包)
    Then 應該要成功綁定我的車號跟錢包

    Given 我在 app
    When 在「檢視資訊」欄位輸入(車號)
    Then 應該要看到我的車號跟錢包

    Given 我在 app
    When 在「修改錢包」欄位輸入(車號 && 錢包)
    Then 應該要成功修改我的錢包

    Given 我在 app
    When 在「刪除錢包」欄位輸入(錢包 && 車號)
    Then 應該要成功刪除我的車號與錢包的綁定

Feature: 儲值
    As a 車主
    I want 把任何代幣儲存到合約裡
    So that 之後可以直接扣款

    Given 我在app
    When 輸入儲值的幣種與數量
    Then 相對應的代幣應該被轉成穩定幣並存到合約裡

Feature: 支付
    As a 車主
    I want 把任何代幣儲存到合約裡
    So that 之後可以直接扣款

    Given 我在app
    When 輸入儲值的幣種與數量
    Then 相對應的代幣應該被轉成穩定幣並存到合約裡

Feature: 回饋
    As a 車麻吉
    I want 給予車主回饋
    So that 吸引車主使用此合約支付

    Given 車主有儲值在合約裡
    When 車主進行支付
    Then 一定比例的金額會返還到車主在合約上的帳戶

Feature: 提領
    As a 加油站
    I want 提領現金
    So that 我可以盈利

    Given 我在合約上
    When 選擇提領功能
    Then 所有我在這個合約裡的錢會先扣除手續費並被轉到我的錢包裡

Feature: 利息
    As a 車麻吉
    I want 給予車主利息
    So that 我可以吸引車主儲值

    Given 我在合約上
    When 選擇給予利息功能
    Then 合約裡所有車主所擁有的代幣都會增值
```

![system design](./system%20design.jpg)