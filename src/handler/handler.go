package handler

import (
	"html/template"
	"net/http"
	"fmt"
	"io/ioutil"
	"bytes"
) 

func Index(w http.ResponseWriter,r *http.Request){
	render(w,"../template/index.html")
}

func render(w http.ResponseWriter, templName string){
	temp , err :=template.ParseFiles(templName)
	if err!=nil{
		http.Error(w,err.Error(),http.StatusInternalServerError)
		return
	}
	temp.Execute(w,"dockerUI")
	return 
}
 

func Images(w http.ResponseWriter, r *http.Request) {
	fmt.Println("images")
	render(w, "../template/Images.html")
}

func SystemJson(w http.ResponseWriter,r * http.Request){
	content , err:=http.Get("http://127.0.0.1:2376/info")
	if(err==nil){
		body ,_ :=ioutil.ReadAll(content.Body)
		var buf=bytes.NewBufferString(r.FormValue("callback")+"("+string(body)+")")
		defer content.Body.Close()
		w.Write(buf.Bytes())
	}
}

func ContainersJson(w http.ResponseWriter, r *http.Request){
	fmt.Println("containerJson"); 
	fmt.Printf(r.FormValue("callback"))
	json, err:= http.Get("http://127.0.0.1:2376/containers/json")
	if(err==nil){ 
	
	body,_:= ioutil.ReadAll(json.Body)   
     var buf=bytes.NewBufferString(r.FormValue("callback")+"("+string(body)+")") 
	defer json.Body.Close()
	 w.Write(buf.Bytes())
	}
}

func Containers(w http.ResponseWriter,r *http.Request){
	fmt.Println("containers")
	render(w,"../template/container.html")
}

func System(w http.ResponseWriter, r * http.Request){
	fmt.Println("system");
	render(w,"../template/system.html")
}