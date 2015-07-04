package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
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
	render(w, "template/index2.html")
}

func images(w http.ResponseWriter, r *http.Request) {
	fmt.Println("images")
	render(w, "template/images.html")
}

func containers(w http.ResponseWriter,r *http.Request){
	fmt.Println("containers")
	render(w,"template/container.html")
}

func main() {
	fmt.Println("dockerUI")
	fmt.Println(http.FileServer(http.Dir(".")))

	http.HandleFunc("/index", index)
	http.HandleFunc("/images", images)
	http.HandleFunc("/containers",containers)

	http.Handle("/static/", http.FileServer(http.Dir(".")))
	err := http.ListenAndServe(":18080", nil)
	if err != nil {
		log.Fatal("Listen:", err)
	}

}
