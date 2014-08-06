function printInventory(inputs) {

  var allItems = loadAllItems();

  var quantitys = calculateQuantitys(inputs, allItems);

  printList(quantitys, allItems);
}

function getAllPromotionBarcodeList(promotionType) {

  var allPromotions = loadPromotions();

  return _.find(allPromotions, { 'type' : promotionType });

}

function calculateQuantitys(inputs, allItems) {

  var quantitys = [];

  _.forEach(inputs, function(input) {
    var itemSpilt = input.split('-');
    var itemBarcode = itemSpilt[0];
    var quantity = Number(itemSpilt[1]) || 1;

    var j = 0;
    _.forEach(allItems, function(item) {
      if(itemBarcode === item.barcode){
        if(quantitys[j] === undefined){
            quantitys[j] = 0;
        }
        quantitys[j] += quantity;
        //break;
      }
      j++;
    });
  });

  return quantitys;
}

function isPromotionItem(item, quantity) {

  var allPromotionBarcodeList = getAllPromotionBarcodeList('BUY_TWO_GET_ONE_FREE');

  var barcode = _.find(allPromotionBarcodeList.barcodes, function(bar) {
    return bar == item.barcode ;
  } );

  if(barcode && quantity > 2){
    return true;
  }

  return false;
}

function printList(quantitys, allItems) {
  var commonOutput = '***<没钱赚商店>购物清单***\n';
  var presenterOutput = '----------------------\n挥泪赠送商品：\n';
  var priceSum = 0;
  var priceSave = 0;

  var i = 0;

  _.forEach(quantitys, function(quantity) {

    if(quantity>0){

      var price = allItems[i].price*quantity;
      var quantityReduce = Math.floor(quantity / 3);
      var priceReduce = allItems[i].price * quantityReduce;
      priceSave += priceReduce;
      priceSum += price - priceReduce;
      commonOutput += '名称：' + allItems[i].name + '，数量：'
                      + quantity + allItems[i].unit + '，单价：'
                      + allItems[i].price.toFixed(2) + '(元)，小计：'
                      + (price - priceReduce).toFixed(2) + '(元)' + '\n';

      if(isPromotionItem(allItems[i], quantity)){
        presenterOutput += '名称：' + allItems[i].name + '，数量：'
                          + quantityReduce + allItems[i].unit + '\n';
      }
    }

    i++;
  });

  var output = commonOutput;
  output += presenterOutput;
  output += '----------------------\n总计：' + priceSum.toFixed(2) + '(元)\n';
  output += '节省：' + priceSave.toFixed(2) + '(元)\n**********************';
  console.log(output);
}
