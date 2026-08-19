import java.util.*;
public class twoD {
    public static void main(String []args){
        Scanner sc=new Scanner(System.in);
        ArrayList<ArrayList<Integer>> list=new ArrayList<>();
        LinkedList<Integer> ll=new LinkedList<>();
        for(int i=0;i<3;i++){
            list.add(new ArrayList<>());
            for(int j=0;j<3;j++){
                list.get(i).add(sc.nextInt());
            }
        }
        for(int i=0;i<3;i++){
            for(int j=0;j<3;j++){
                int curr=list.get(i).get(j);
                if(curr<5){
                    ll.add(curr*2);
                }
            }
        }
        // for(int i=0;i<3;i++){
        //     for(int j=0;j<3;j++){
        //         System.out.print(list.get(i).get(j)+" ");
        //     }
        // }
        // System.out.println();
        // for(int i=0;i<ll.size();i++){
        //     System.out.print(ll.get(i)+" ");
        // }
        System.out.println(list);
        System.out.println(ll);
    }
}
