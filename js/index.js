$(document).ready(function () {
    var productTemplate = $("#productTemplate").html(),
        deliveryAvailabilityTemplate = $("#deliveryAvailabilityTemplate").html(),
        footerLinksMainTemplate = $("#footerLinksMainTemplate").html(),
        compiledTemplate = Handlebars.compile(productTemplate),
        compiledDeliveryAvailabilityTemplate = Handlebars.compile(deliveryAvailabilityTemplate),
        compiledFooterTemplate = Handlebars.compile(footerLinksMainTemplate),
        output, footerOutput, deliveryAvailabilityOutput;

    Handlebars.registerHelper("generateId", function(value, id){return value+"_"+id;});
    Handlebars.registerHelper("isFree", function(value){
        if (value > 0) {
            return true;
        } else {
            return false;
        }
    });
    Handlebars.registerHelper("canShowGift", function(qty) { 
        if (qty && parseInt(qty) > 0) {
            return "";
        } else {
            return "display: none";
        }
    });
    Handlebars.registerHelper("isExist", function(context){
        if(context.qty) {
            return true;
        } else {
            return false;
        } 
    });

    var dataFromLocalStorage = localStorage.getItem("shppingCartData");
    if (!dataFromLocalStorage) {
        var db = {
            "products": [
                {
                "id": 1,
                "name": "Earphones",
                "price": 12690,
                "imageUrl": "./Images/Earphone.png",
                "desc": "Silver"
                },
                {
                "id": 2,
                "tagline": "200 Cash back",
                "name": "Test 6X",
                "price": 14000,
                "imageUrl": "./Images/phone.png",
                "desc": "32GB Gold \n\n Extended Warranty",
                "planLink": "http://pointstonothing.com/linktoplan",
                "gift": {
                    "name": "Glory Selfie Stick",
                    "desc": "Silver Moon",
                    "price": 175,
                    "imageUrl": "./Images/Stick.png",
                }
                },
                {
                "id": 3,
                "name": "Test 6X",
                "price": 18000,
                "imageUrl": "./Images/phone.png",
                "desc": "64GB Gold \n\n Extended Warranty",
                "planLink": "http://pointstonothing.com/linktoplan",
                "gift": {
                    "name": "Glory Selfie Stick",
                    "desc": "Silver Moon",
                    "price": 175,
                    "imageUrl": "./Images/Stick.png",
                }
                },
                {
                "id": 4,
                "tagline": "100 Cash back",
                "name": "Earphones",
                "price": 11690,
                "imageUrl": "./Images/Earphone.png",
                "desc": "White"
                },
                {
                "id": 5,
                "name": "Earphones",
                "price": 11690,
                "imageUrl": "./Images/Earphone.png",
                "desc": "Orange"
                },
                {
                "id": 6,
                "name": "Test 5X",
                "price": 10000,
                "imageUrl": "./Images/phone.png",
                "desc": "32GB Gold"
                }
            ],
            "pincode": {
                "560066": {
                "deliveryPrice": 50,
                "cashOnDelivery": false,
                "estimatedDays": {
                    "min": 2,
                    "max": 5
                }
                },
                "560067": {
                "deliveryPrice": 0,
                "cashOnDelivery": true,
                "estimatedDays": {
                    "min": 3,
                    "max": 5
                }
                },
                "560068": {
                "deliveryPrice": 0,
                "cashOnDelivery": false,
                "estimatedDays": {
                    "min": 5,
                    "max": 5
                }
                }
            },
            "discount": {
                "minTotal": 5000,
                "discountPercentage": 10
            }
        };
        localStorage.setItem("shppingCartData", JSON.stringify(db));
    } else {
        db = JSON.parse(dataFromLocalStorage);
    }

    output = compiledTemplate(db.products);
    deliveryAvailabilityOutput = compiledDeliveryAvailabilityTemplate();
    footerOutput = compiledFooterTemplate([
        {itemValue1: "dummyText", itemValue2: "dummyText",itemValue3: "dummyText",itemValue4: "dummyText"},
        {itemValue1: "dummyText", itemValue2: "dummyText",itemValue3: "dummyText",itemValue4: "dummyText"},
        {itemValue1: "dummyText", itemValue2: "dummyText",itemValue3: "dummyText",itemValue4: "dummyText"},
        {itemValue1: "dummyText", itemValue2: "dummyText",itemValue3: "dummyText",itemValue4: "dummyText"},
        {itemValue1: "dummyText", itemValue2: "dummyText",itemValue3: "dummyText",itemValue4: "dummyText"},
        {itemValue2: "dummyText", itemValue3: "dummyText",itemValue4: "dummyText"},
        {itemValue2: "dummyText", itemValue3: "dummyText",itemValue4: "dummyText"},
        {itemValue2: "dummyText", itemValue3: "dummyText"}
    ]);

    document.getElementById("productPlaceholder").innerHTML = output;
    document.getElementById("footerLinksMain").innerHTML = footerOutput;
    
    document.getElementById("deliveryAvailability").innerHTML = deliveryAvailabilityOutput;

    showPrices();

    $(".qtyInput").on("click focus blur", function(value){
        var selectedId = (this.id).split("_")[1];
        var incDom = $("#qtyInput_"+selectedId);
        var subTotalDom = $("#subTotal_"+selectedId);
        var priceDom = $("#price_"+selectedId);
        var decItemDom = $("#decItem_"+selectedId);
        var decItemActiveDom = $("#decItemActive_"+selectedId);
        var giftDom = $("#gift_"+selectedId);
        if(incDom && subTotalDom && priceDom) {
            subTotalDom.text(parseInt(priceDom.text()) * parseInt(incDom.val()) + " $");
            updateItem(selectedId, false, parseInt(incDom.val()), parseInt(subTotalDom.text()));
            if (giftDom) {
                giftDom.find(".qty").text(incDom.val());
                if(parseInt(incDom.val()) > 0) {
                    giftDom.show();
                } else {
                    giftDom.hide();
                }
            }
        }
        if (parseInt(incDom.val())) {
            decItemActiveDom.show();
            decItemDom.hide();
        } else {
            decItemActiveDom.hide();
            decItemDom.show();
        }
    });

    $(".incItem").click(function(value){
        var selectedId = (this.id).split("_")[1];
        var incDom = $("#qtyInput_"+selectedId);
        if(incDom) {
            incDom.val(parseInt(incDom.val()) + 1);
            incDom.trigger("click");
        }
    });

    $(".decItem, .decItemActive").click(function(value){
        var selectedId = (this.id).split("_")[1];
        var incDom = $("#qtyInput_"+selectedId);
        if(incDom && parseInt(incDom.val())) {
            incDom.val(parseInt(incDom.val()) - 1);
            incDom.trigger("click");
        }
    });

    $(".deleteItem").click(function(value){
        var selectedId = (this.id).split("_")[1];
        var giftDom = $("#gift_"+selectedId);
        if($("#"+selectedId)) {
            $("#"+selectedId).remove();                 
            if (giftDom) {
                giftDom.remove();
            }
            updateItem(selectedId, true);
        }
    });

    $("#clearLocalStorage").click(function(value){
        localStorage.removeItem("shppingCartData");
        document.location.reload();
    });

    $("#pinCodeChange").click(function(){
        var pinCode = parseInt($("#pinCode").val());
        var pinCodes = db.pincode;
        var selectedPincodeObject = pinCodes[pinCode];

        var codCheckDom = $("#cod");
        var freeCheckDom = $("#free");
        var estCheckDom = $("#est");
        var estTimeMsgDom = $("#estTimeMsg");
        var shippingFinalDom = $("#shipping_final");

        if (selectedPincodeObject && selectedPincodeObject.cashOnDelivery) {
            codCheckDom.show();
        } else {
           codCheckDom.hide(); 
        }

        if (selectedPincodeObject && selectedPincodeObject.deliveryPrice > 0) {
            freeCheckDom.show();
            shippingFinalDom.html("<b>FREE</b>");
        } else {
            freeCheckDom.hide();
        }

        if (selectedPincodeObject &&  selectedPincodeObject.estimatedDays && selectedPincodeObject.estimatedDays.min && selectedPincodeObject.estimatedDays.max) {
            if (selectedPincodeObject.estimatedDays.min === selectedPincodeObject.estimatedDays.max) {
                estTimeMsgDom.html("Estimated delivery<br>time is "+selectedPincodeObject.estimatedDays.min+" days");
            } else {
                estTimeMsgDom.html("Estimated delivery<br>time is "+selectedPincodeObject.estimatedDays.min+" - "+selectedPincodeObject.estimatedDays.max+" days");
            }
        } else {
            estTimeMsgDom.html("We don't serve in this area yet!");
        }

    });

    function getTotal(){
        var totalSubtotal = 0;
        var total = 0;
        var discount = db.discount;
        _.forEach(db.products, function(item){
            if(item.qty) {
                totalSubtotal = totalSubtotal + (item.price * item.qty);
                if (totalSubtotal >= discount.minTotal) {
                    total = totalSubtotal - (totalSubtotal * (discount.discountPercentage/100));
                }
            }
        });
        return {
            "subTotal": totalSubtotal,
            "total": total,
            "discount": (totalSubtotal * (discount.discountPercentage/100))
        };
    }

    function updateItem(id, isRemoved, qty, subTotal) {
        if (isRemoved) {
            db.products = _.filter(db.products, function(item) {
                return parseInt(item.id) !== parseInt(id);
            });
        } else {
            _.forEach(db.products, function(item, index){
                if (parseInt(item.id) === parseInt(id)) {
                    if (qty) {
                        item.qty = parseInt(qty);
                    }
                    if (subTotal) {
                        item.subTotal = parseInt(subTotal);
                    }
                }
            });
        }
        showPrices();
        localStorage.setItem("shppingCartData", JSON.stringify(db));
    }

    function showPrices() {
        var subTotalFinalDom = $("#subTotal_final");
        var discountFinalDom = $("#discount_final");
        var totalFinalDom = $("#total_final");
        var total = getTotal();
        if (total && total.subTotal && total.total && total.discount) {
            subTotalFinalDom.html(total.subTotal);
            discountFinalDom.html("-"+total.discount);
            totalFinalDom.html("<b>"+total.total+"</b>");
        }
    }

});