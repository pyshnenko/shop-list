let block = true;

export default function checkApiBlock() {
    if (block) {
        block = false;
        setTimeout(block=true, 1000);
        return true;
    }
    else return false;
}