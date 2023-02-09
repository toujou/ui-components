# Toujou Input Date Mask

@todo add description

## Installation

      npm install @toujou/toujou-input-date-mask

## Usage
    

```html

<toujou-input-date-mask
    mask="dd.mm.yyyyy"
>
    <input placeholder="tt.mm.jjjj" 
           required="required" 
           autocomplete="off" 
           type="tel"
    >
</toujou-input-date-mask>

```    
    
## Properties

|                 Name                  |    Type     |           Default           | Description                                                                                                                  |
|:-------------------------------------:|:-----------:|:---------------------------:|:-----------------------------------------------------------------------------------------------------------------------------|
|              **`mask`**               | `{String}`  |        'dd.mm.yyyy'         | Mask format                                                                                                                  |
|       **`show_mask_on_focus`**        | `{Boolean}` |           `false`           | If this option - true, the mask will only be displayed when an event occurs onFocus                                          |
|       **`show_mask_on_hover`**        | `{Boolean}` |           `false`           | If this option - true, when you mouse over the input, the mask appears, when you mouse  leave the input, the mask disappears |
| **`custom-validation-error-message`** | `{String}`  | `Please enter a valid date` | Validation error message                                                                                                     |
