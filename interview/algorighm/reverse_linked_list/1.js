function reverseList(head){
    let prev=null;// 前一个节点
    let curr=head;// 当前节点
    // 空 跳出
    while(curr){
        const next=curr.next;
        curr.next=prev;
        prev=curr;
        curr=next;
    }
    return prev;
}