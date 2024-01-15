export const sortArrObject = (data, valueSort, typeSort) => {
  let temp = [];
  let arrNumber = [];
  let arrString = [];
  for (let i = 0; i < Number(data.length); i++) {
    if (data[i][valueSort] / 2 > 0) {
      arrNumber.push(data[i]);
    } else {
      arrString.push(data[i]);
    }
  }
  arrNumber = arrNumber.sort((a, b) => {
    return (a[valueSort] - b[valueSort]) * typeSort;
  });
  arrString = arrString.sort((a, b) => {
    return a[valueSort].toString().localeCompare(b[valueSort].toString()) > 0
      ? 1 * typeSort
      : a[valueSort].toString().localeCompare(b[valueSort].toString()) < 0
      ? -1 * typeSort
      : 0;
  });
  temp =
    typeSort > 0 ? arrNumber.concat(arrString) : arrString.concat(arrNumber);
  return temp;
};
