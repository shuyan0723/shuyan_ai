// 1->2->3->4->5->null 翻转

function reverseListRecursive(head){
    // 递归介绍条件
    if(!head||!head.next){
        return head;
    }

    // 递归调用 交给下一个
    // 回溯？ 
    const newHead=reverseListRecursive(head.next);

    head.next.next=head;
    head.next=null;
    return newHead;
}


