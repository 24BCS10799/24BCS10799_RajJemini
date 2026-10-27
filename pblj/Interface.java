abstract class c1{
    int x;
    c1(){

    }
    c1(int x)
    {
        this.x=x;
    }
    abstract void abc();
}
interface i1{
    int x=10;
    void abc();
    default void qwe(){
        System.out.println("World");
    }

}
class c2 implements i1{
    public void abc(){
        System.out.println("Hello");
    }
}
class javaex{
    public static void main(String []args){
        c2 obj=new c2();
        obj.abc();
        System.out.println(c2.x);
        obj.qwe();
    }
}
