{{#each this}}
    <tr class="productRow" id={{id}}>
        <td class="product">
            <table>
                <tbody>
                    <tr>
                        <td class="productImage"><img src={{imageUrl}}></td>
                        <td>{{#if this.tagline}}<span class="tagline">{{tagline}}</span><br>
                            {{else if this.gift}}<span class="gift">GIFT</span><br>
                            {{/if}}
                            <span class="productDescription">{{name}}</span><br><span class="productSubDescription">{{desc}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
        <td class="price">
            {{#if this.gift.price}}
                <span id={{generateId "price" id}}>{{gift.price}}</span>
            {{else if this.price}}
                <span id={{generateId "price" id}}>{{this.price}}</span>
            {{/if}}
        </td>
        <td class="qty">
            <span class="decItem" id={{generateId "decItem" id}}><img src="./icon/minus.png"></span>
            <span class="decItemActive" id={{generateId "decItemActive" id}}><img src="./icon/minus-active.png"></span>
            {{#if (isExist this)}}
                <span><input type="number" id={{generateId "qtyInput" id}} class="qtyInput" value="{{this.qty}}" min="0"></span>
            {{else}}
                <span><input type="number" id={{generateId "qtyInput" id}} class="qtyInput" value="0" min="0"></span>
            {{/if}}
            <span class="incItem" id={{generateId "incItem" id}}><img src="./icon/plus.png"></span>
        </td>
        <td class="subTotal">
            <div  style="display: inline-block; width: 50px;">
                {{#if this.subTotal}}
                    <span id={{generateId "subTotal" id}}>{{subTotal}}</span>
                {{else}}
                    <span id={{generateId "subTotal" id}}>0</span>
                {{/if}}
            </div>
            <div style="display: inline-block;">
                <button class="deleteItem" id={{generateId "deleteItem" id}}><img src="./icon/DELETE.png"></button>
            </div>
        </td>
    </tr>
{{/each}}