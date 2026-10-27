abstract class bankserver{
    private static int bal=3000;
    void getbalance()
    {
        System.out.println(bal);
    }
    void setbalance(int balance)
    {
        bal=balance;
        System.out.println(bal);
    }
}
class sbi extends bank{
    int debit(int amount){
        int currentbalance =super.getbalance();
        currentbalance=currentbalance-amount;
        super.setbalance(currentbalance);
    }
}
public class bank {
    public static void main(String[] args){
        sbi s=new sbi();
        s.debit(1000);
    }
}
