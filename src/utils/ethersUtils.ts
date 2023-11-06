import { ethers } from 'ethers';

export const sliceFloat = (float: string, index: number):string => {
  const integerPart = float.split(".")[0];
  const decimalPart = float.split(".")[1]?.slice(0, index) || "";
  const fixedFloat = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  return fixedFloat;
}

export const gWeiToWei = (gwei: string):string => {
  return ethers.utils.parseUnits(gwei, 9).toString();
}

export const isAddress = (address:string):boolean => {
  return ethers.utils.isAddress(address);
}

export function fixedWeiToETH(wei: ethers.BigNumberish): string {
  let bigNumber: bigint;
  if (typeof wei === "bigint") {
    bigNumber = wei;
  } else {
    bigNumber = BigInt(wei.toString());
  }
  const float = ethers.utils.formatUnits(bigNumber, "ether");
  const integerPart = float.split(".")[0];
  const decimalPart = float.split(".")[1]?.slice(0, 6) || "";
  const fixedEth = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  return fixedEth;
}