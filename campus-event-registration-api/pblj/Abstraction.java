abstract class shape{
    abstract double calculateArea();
    void display(){
        System.out.println("This is a shape");
    }
}
class circle extends shape{
    int r;
    circle(int r){
        this.r=r;
    }
    double calculateArea(){
        double res=3.14*r*r;
        return res;
    }
}
class rectangle extends shape{
    int w;
    int l;
    rectangle(int l,int w){
        this.l=l;
        this.w=w;
    }
    double calculateArea(){
        double res=2*(l+w);
        return res;
    }
}
public class question1 {
    public static void main(String [] args){
        shape objc=new circle(5);
        shape objr=new rectangle(6,2);
        objc.display();
        System.out.println(objc.calculateArea());
        System.out.println(objr.calculateArea());
    }
}
