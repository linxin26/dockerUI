package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"io/ioutil"
	"bytes"
)

type IndexData struct {
	title string
}

func render(w http.ResponseWriter, templName string) {
	tmpl, err := template.ParseFiles(templName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	tmpl.Execute(w, "dockerUI")
	return
}

func index(w http.ResponseWriter, r *http.Request) {
	fmt.Println("index ")
	render(w, "../template/index2.html")
}

func images(w http.ResponseWriter, r *http.Request) {
	fmt.Println("images")
	render(w, "../template/Images.html")
}

func containersJson(w http.ResponseWriter, r *http.Request){
	fmt.Println("containerJson"); 
	fmt.Printf(r.FormValue("callback"))
	json, err:= http.Get("http://127.0.0.1:2375/containers/json")
	if(err==nil){ 
	body,_:= ioutil.ReadAll(json.Body)  
//	 var buf= bytes.NewBufferString("\"result\":"+string(body)+",\"__count\": \"830\"")
     var buf=bytes.NewBufferString(r.FormValue("callback")+"("+string(body)+")")
//	fmt.Println(buf.Bytes())
	defer json.Body.Close()
	 w.Write(buf.Bytes())
	}
}

func containers(w http.ResponseWriter,r *http.Request){
	fmt.Println("containers")
	render(w,"../template/container.html")
}

func main() {
	fmt.Println("dockerUI")
	fmt.Println(http.FileServer(http.Dir(".")))

	http.HandleFunc("/index", index)
	http.HandleFunc("/images", images)
	http.HandleFunc("/containers",containers)
	http.HandleFunc("/containersJson",containersJson)

	http.Handle("/static/", http.FileServer(http.Dir("../")))
	err := http.ListenAndServe(":18080", nil)
	if err != nil {
		log.Fatal("Listen:", err)
	}

}
