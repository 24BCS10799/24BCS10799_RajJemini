class BankAccount1{
    private String accNo;
    private double Bal;
    BankAccount1(String accNo,double Bal){
        this.accNo=accNo;
        this.Bal=Bal;
    }
    double getBalance(){
        return Bal;
    }
    void setBalance(double amount){
        if(amount>=0){
            this.Bal=amount;
        }
    }
    void deposit(double amount){
        if(amount>0){
            this.Bal=this.Bal+amount;
        }
    }
    void withdraw(double amount){
        if(amount>0&&amount<=this.Bal){
            this.Bal=this.Bal-amount;
        }
    }
}
public class BankAccount{
    public static void main(String[]args){
    BankAccount1 obj=new BankAccount1("10799",1000);
    obj.deposit(1000);
    obj.withdraw(500);
    System.out.println(obj.getBalance());
    //System.out.println(obj.Bal);
    }
}
